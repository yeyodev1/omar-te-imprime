// Solo el cloud name es público; la API key/secret nunca van en el frontend.
const CLOUD = 'ddsornfr'
const FOLDER = 'omar-te-imprime'

export function cld(id: string, width = 900) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${width}/${FOLDER}/${id}`
}

export function cldSet(id: string, widths = [480, 768, 1080, 1400]) {
  return widths.map((w) => `${cld(id, w)} ${w}w`).join(', ')
}

// Recorte inteligente centrado en la cara (útil para reutilizar una foto con otro encuadre).
export function cldFace(id: string, width: number, height: number, zoom = 0.75) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_thumb,g_face,z_${zoom},w_${width},h_${height}/${FOLDER}/${id}`
}
