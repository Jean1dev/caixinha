import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: 'caixinha-client-id',
      clientSecret: `${process.env.AUTH_SECRET}`,
      issuer: 'https://lemur-5.cloud-iam.com/auth/realms/caixinha-auth-server',
    })
  ]
})
