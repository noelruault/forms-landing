import Image from 'next/image'

import { Container } from '@/components/Container'
import avatarImage1 from '@/images/avatars/avatar-1.webp'
import avatarImage2 from '@/images/avatars/avatar-2.webp'
import avatarImage3 from '@/images/avatars/avatar-3.webp'
import avatarImage4 from '@/images/avatars/avatar-4.webp'
import avatarImage5 from '@/images/avatars/avatar-5.webp'

const text = {
  title: 'Amada por estudiantes y profesores de todo el mundo.',
  description:
    'Nuestra plataforma es tan intuitiva que es imposible no enamorarse de ella. La simplicidad es fácil cuando simplemente dejas de lado un montón de características que nadie pidió.',
}

const testimonials = [
  [
    {
      content:
        "Lo mejor de esta plataforma es que desde que la uso tengo la sensación de que estudio mucho más.",
      author: {
        name: 'Sergio Pérez',
        role: 'Profesor de Ciberseguridad en la UA',
        image: avatarImage5,
      },
    },
    {
      content:
        "Hay tantas cosas que tenía que hacer con mi antiguo método de estudio que ahora simplemente no hago. Es sospechoso, pero no puedo negar que me encanta.",
      author: {
        name: 'Elena Ruiz',
        role: 'Estudiante de Medicina en la UOC',
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        "Antes tenía que gestionar mis proyectos académicos con varias herramientas distintas, pero desde que uso esta plataforma todo es más rápido y... bueno, me ahorro bastante tiempo.",
      author: {
        name: 'Fernando Martínez',
        role: 'Profesor de Psicología en la UIB',
        image: avatarImage3,
      },
    },
    {
      content:
        "Puedo usar la plataforma en cualquier dispositivo, lo que me permite estudiar en cualquier lugar. Aunque, siendo sincera, utilizo más el móvil entre los huecos cuando estoy de guardia.",
      author: {
        name: 'Lucía Fernández',
        role: 'Estudiante de Informática en la UA',
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        "Esta herramienta es tan fácil de usar que me pregunto si realmente estoy aprendiendo tanto como creo. A veces la simplicidad me da miedo.",
      author: {
        name: 'Carla García',
        role: 'Profesora de Informática en la UOC',
        image: avatarImage1,
      },
    },
  ],
]


function QuoteIcon(props) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Lo que dicen nuestros alumnos"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {text.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            {text.description}
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                      <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
                      <blockquote className="relative">
                        <p className="text-lg tracking-tight text-slate-900">
                          {testimonial.content}
                        </p>
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                        <div>
                          <div className="font-display text-base text-slate-900">
                            {testimonial.author.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {testimonial.author.role}
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-full bg-slate-50">
                          <Image
                            className="h-14 w-14 object-cover"
                            src={testimonial.author.image}
                            alt=""
                            width={56}
                            height={56}
                          />
                        </div>
                      </figcaption>
                    </figure>
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
