// Única fuente de datos comerciales para las páginas generadas.
export default Object.freeze({
  name: 'Rigel México',
  siteUrl: process.env.SITE_URL || 'https://rigelsa.com/mx/',
  email: 'ventasmexico@rigelsa.com',
  careersEmail: 'rrhh@rigelsa.com',
  phone: '+52 999 635 1998',
  whatsapp: '529996351998',
  address: 'Calle 62 diagonal, número 256, Jacinto Canek, Mérida, Yucatán, C.P. 97227.',
  hours: ['Lunes a viernes: 9:00–18:00. Sábado: 9:00–13:00.', 'Monday–Friday: 9:00 am–6:00 pm. Saturday: 9:00 am–1:00 pm.'],
  regions: [
    ['México', 'https://rigelsa.com/mx/', 'mx'],
    ['Ecuador', 'https://rigelsa.com/', 'ec'],
    ['Colombia', 'https://rigelsa.com/co/', 'co'],
    ['Brasil', 'https://rigelsa.com.br/', 'br']
  ]
});
