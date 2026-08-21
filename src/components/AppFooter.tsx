import { Link } from '@mui/material'
import { APP_EMAIL, APP_FEEDBACK_URL } from '../lib/brand'

const publicUrl = process.env.PUBLIC_URL || ''

export default function AppFooter() {
  return (
    <footer className="appFooter">
      <div className="shellInner">
        <div className="appFooter__links">
          <Link
            href={`${publicUrl}/legal/privacy-policy.txt`}
            underline="hover"
            target="_blank"
            rel="noopener"
          >
            Privacy Policy
          </Link>
          <Link
            href={`${publicUrl}/legal/terms-of-service.txt`}
            underline="hover"
            target="_blank"
            rel="noopener"
          >
            Terms of Service
          </Link>
        </div>
        <p className="appFooter__note">
          Questions?{' '}
          <Link href={`mailto:${APP_EMAIL}`}>Email me</Link>
          {' · '}
          <Link href={APP_FEEDBACK_URL} target="_blank" rel="noopener">
            Feedback form
          </Link>
        </p>
      </div>
    </footer>
  )
}
