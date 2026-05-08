import axios from 'axios'
import { entorno } from '../config/entorno'
import { ErrorHttp } from '../middlewares/errores'
import type { PublicacionIA } from '../types'

interface RespuestaDeepSeek {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

const construirPrompt = (cantidad: number): string => {
  return `Eres un editor de noticias tecnológicas. Genera exactamente ${cantidad} publicaciones sobre noticias tecnológicas actuales y relevantes de las últimas 24 horas.

Para cada publicación incluye:
- titulo: título claro, informativo y atractivo (máx. 100 caracteres)
- resumen: resumen objetivo de máximo 300 palabras
- pregunta: pregunta controversial que invite al debate técnico
- etiquetas: array de 2-3 categorías (ej: "IA", "programación", "hardware", "startups", "ciberseguridad")

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional.`
}

export const generarPublicacionesIA = async (cantidad: number): Promise<PublicacionIA[]> => {
  if (!entorno.deepseek.apiKey) {
    throw new ErrorHttp('DEEPSEEK_API_KEY no está configurada', 500)
  }

  const respuesta = await axios.post<RespuestaDeepSeek>(
    entorno.deepseek.url,
    {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: construirPrompt(cantidad) }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${entorno.deepseek.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 25000,
    }
  )

  const contenido = respuesta.data.choices?.[0]?.message?.content?.trim()
  if (!contenido) {
    throw new ErrorHttp('DeepSeek no devolvió contenido', 502)
  }

  try {
    const publicaciones = JSON.parse(contenido) as PublicacionIA[]
    if (!Array.isArray(publicaciones)) {
      throw new Error('Respuesta no es array')
    }
    return publicaciones
  } catch {
    throw new ErrorHttp('No se pudo parsear la respuesta JSON de DeepSeek', 502)
  }
}
