import { PRODUCT_MODES, type ProductMode } from '../lib/productMode'
import { AuthButton } from './auth/AuthButton'

type Props = {
  mode: ProductMode
}

export default function LandingPage({ mode }: Props) {
  const config = PRODUCT_MODES[mode]

  return (
    <section className="landing">
      <h1 className="landing__brand">{config.name}</h1>
      <p className="landing__headline">{config.tagline}</p>
      <p className="landing__lead">{config.description}</p>
      <div className="landing__cta">
        <AuthButton fullWidth />
      </div>
      {config.landingNote ? (
        <p className="landing__note">{config.landingNote}</p>
      ) : null}
    </section>
  )
}
