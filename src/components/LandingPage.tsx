import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '../lib/brand'
import { AuthButton } from './auth/AuthButton'

const publicUrl = process.env.PUBLIC_URL || ''

export default function LandingPage() {
  return (
    <section className="landing">
      <h1 className="landing__brand">{APP_NAME}</h1>
      <p className="landing__headline">{APP_TAGLINE}</p>
      <p className="landing__lead">{APP_DESCRIPTION}</p>
      <div className="landing__cta">
        <AuthButton fullWidth />
      </div>
      <div className="landing__visual">
        <img
          src={`${publicUrl}/media/demo-image.png`}
          alt="Example Yearify year calendar visualization"
        />
      </div>
    </section>
  )
}
