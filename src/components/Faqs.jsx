import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.webp'

const text = {
  title: 'Preguntas frecuentes',
  description:
    'Si no encuentras lo que buscas, envía un correo electrónico a nuestro equipo de soporte y si tienes suerte, alguien te responderá.',
}
const faqs = [
  [
    {
      question: '¿La plataforma gestiona planes de estudio personalizados?',
      answer:
        'Nuestros profesores pueden crear planes de estudio personalizados exclusivos para ti.',
    },
    {
      question: '¿Puedo pagar mi suscripción con criptomonedas?',
      answer: '¡Por supuesto! Aceptamos cualquier forma de pago, siempre que sea dinero.',
    },
  ],
  [
    {
      question:
        'Esto suena complicado, ¿por qué aún así quiero suscribirme?',
      answer:
        'Porque gracias a mucho estudio y años de experiencia en la docencia, sabemos exactamente lo que necesitas.',
    },
    {
      question: 'He visto plataformas similares, ¿estáis seguros de que vuestro algoritmo es único?',
      answer:
        'La verdad es que las hemos probado todas y hemos desarrollado lo que más nos gustaba. Así que sí, es único.',
    },
  ],
  [
    {
      question: '¿Cómo generáis los gráficos de progreso?',
      answer:
        'Con un poco de magia y mucha programación. Pero no te preocupes, no necesitas saber cómo funciona sino que los datos sean reales.',
    },
    {
      question: 'Perdí mi contraseña, ¿cómo puedo entrar a mi cuenta?',
      answer:
        'Mándanos un correo y te enviaremos una copia de nuestro archivo de contraseñas para que busques la tuya 😉.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {text.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            {text.description}
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
