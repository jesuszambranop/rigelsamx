<?php
declare(strict_types=1);
require __DIR__.'/../public/api/core.php';
$config = require __DIR__.'/../public/api/config.php';
$checks = 0;
function verify(bool $value,string $message): void {global $checks;if (!$value) throw new RuntimeException($message);$checks++;}
function rejects(callable $fn): void {try {$fn();} catch(FormError $e) {verify(true,'');return;}throw new RuntimeException('Se aceptó entrada inválida');}
$contact = ['kind'=>'contact','consent'=>'1','name'=>'Prueba Técnica','email'=>'visitante@example.invalid','city'=>'Mérida','company'=>'Empresa de prueba','product'=>'m1','material'=>'Cartón','volume'=>'100 al día','message'=>'Consulta de prueba de la M1.','phone'=>'+52 999 000 0000'];
$data=validate_submission($contact);
$mail=mailer_for($config,$data);
verify($mail->From==='ventasmexico@rigelsa.com','Remitente de contacto');
verify($mail->Sender==='ventasmexico@rigelsa.com','Remitente de sobre');
verify($mail->getToAddresses()[0][0]==='ventasmexico@rigelsa.com','Destino de contacto');
verify($mail->getReplyToAddresses()[0][0]==='visitante@example.invalid','Reply-To visitante');
verify($mail->preSend(),'Crear MIME sin enviar');
verify(strpos($mail->getSentMIMEMessage(),'Cartón')!==false || strpos($mail->getSentMIMEMessage(),'Cart=C3=B3n')!==false,'Material en MIME');
foreach ([['email'=>"x@example.invalid\r\nBcc: otro@example.invalid"],['product'=>'otro'],['consent'=>'0'],['name'=>['mal']],['website'=>'spam'],['message'=>'corto']] as $bad) rejects(fn()=>validate_submission(array_replace($contact,$bad)));
$career = ['kind'=>'careers','consent'=>'1','name'=>'Prueba Empleo','email'=>'candidato@example.invalid','city'=>'Mérida','area'=>'marketing','phone'=>'+52 999 000 0000','message'=>'Perfil de prueba para el equipo.'];
$data=validate_submission($career);
$tmp=tempnam(sys_get_temp_dir(),'rigel-test-');
$docx=tempnam(sys_get_temp_dir(),'rigel-docx-');
try {
    file_put_contents($tmp,"%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF\n");
    $resume=validate_resume(['name'=>'cv.pdf','tmp_name'=>$tmp,'error'=>UPLOAD_ERR_OK],false);
    $mail=mailer_for($config,$data,$resume);
    verify($mail->getToAddresses()[0][0]==='rrhh@rigelsa.com','Destino RRHH');
    verify($mail->From==='ventasmexico@rigelsa.com','Remitente empleo');
    verify($mail->preSend(),'Crear correo con CV');
    verify(strpos($mail->getSentMIMEMessage(),'CV-Rigel-Mexico.pdf')!==false,'Adjunto en MIME');
    $file=['name'=>'cv.pdf','tmp_name'=>$tmp,'error'=>0];
    rejects(fn()=>validate_career_attachments(['resume'=>$file],'marketing',false));
    [$cv,$portfolio]=validate_career_attachments(['resume'=>$file,'portfolio'=>$file],'marketing',false);
    $mail=mailer_for($config,$data,$cv,$portfolio);
    verify($mail->preSend(),'Crear postulación Marketing con dos adjuntos');
    verify(strpos($mail->getSentMIMEMessage(),'Portafolio-Rigel-Mexico.pdf')!==false,'Portafolio adjunto');
    rejects(fn()=>validate_career_attachments(['resume'=>$file,'portfolio'=>$file],'sales',false));
    $zip=new ZipArchive();$zip->open($docx,ZipArchive::CREATE|ZipArchive::OVERWRITE);
    $zip->addFromString('[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    $zip->addFromString('word/document.xml','<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>CV de prueba</w:t></w:r></w:p></w:body></w:document>');
    $zip->close();
    $word=validate_resume(['name'=>'cv.docx','tmp_name'=>$docx,'error'=>0],false);
    verify($word['mime']==='application/vnd.openxmlformats-officedocument.wordprocessingml.document','DOCX validado por contenido');
    $mail=mailer_for($config,$data,$word,$portfolio);
    verify($mail->preSend(),'Crear MIME con DOCX y portafolio PDF');
    verify(strpos($mail->getSentMIMEMessage(),'CV-Rigel-Mexico.docx')!==false,'CV Word adjunto');
    rejects(fn()=>validate_attachment(['name'=>'portafolio.docx','tmp_name'=>$docx,'error'=>0],['pdf'],'Portafolio',false));
    rejects(fn()=>validate_resume(['name'=>'cv.php','tmp_name'=>$tmp,'error'=>0],false));
    file_put_contents($tmp,'No es un PDF');
    rejects(fn()=>validate_resume(['name'=>'cv.pdf','tmp_name'=>$tmp,'error'=>0],false));
    rejects(fn()=>validate_resume(['name'=>'cv.docx','tmp_name'=>$tmp,'error'=>0],false));
    rejects(fn()=>validate_resume(['name'=>'cv.doc','tmp_name'=>$tmp,'error'=>0],false));
    file_put_contents($tmp,str_repeat('x',5*1024*1024+1));
    rejects(fn()=>validate_resume(['name'=>'cv.pdf','tmp_name'=>$tmp,'error'=>0],false));
} finally {unlink($tmp);unlink($docx);}
$noMessage=$career;unset($noMessage['message']);
verify(validate_submission($noMessage)['area']==='marketing','Empleo no exige un mensaje que Colombia no solicita');
rejects(fn()=>validate_submission(array_replace($career,['area'=>'inventada'])));
echo "OK: $checks comprobaciones de validación, destinatarios y MIME. No se enviaron correos.\n";
