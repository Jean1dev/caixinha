import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: 'caixinha-client-id',
      clientSecret: 'eafccc53-8bb1-4945-8fe1-3a31f094356d',
      issuer: 'https://lemur-5.cloud-iam.com/auth/realms/caixinha-auth-server',
    })
  ]
})
