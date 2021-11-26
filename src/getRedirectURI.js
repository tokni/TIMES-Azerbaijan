export default function getRedirectUri() {
    if (process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "internal") return "https://internal--times-azerbaijan.vercel.app/"
    else if (process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "master") return "https://times-azerbaijan.vercel.app/"
    else if (process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "develop") return "https://develop--times-azerbaijan.vercel.app/"
    else if (process.env.NODE_ENV === 'development') return "http://localhost:3000"
  }