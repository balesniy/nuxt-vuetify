<template>
  <main>
    <!-- if the user is not signed in, show the sign in form -->
    <div v-if="!profile && !submitted" class="d-flex flex-column mb-6">
      <h2 class="title">
        Sign up / sign in
      </h2>
      <b-field
        label="Email"
        :type="{ 'is-danger': hasError }"
        :message="{ 'Username is not available': hasError }"
      >
        <b-input
          v-model="email"
          type="email"
          placeholder="jessica@example.com"
          maxlength="30"
        />
      </b-field>
      <div class="control">
        <b-button type="is-primary" @click="signIn">
          Submit
        </b-button>

        <b-button type="is-primary is-light" @click="signInWithGoogle">
          signIn With Google
        </b-button>
      </div>
    </div>
    <!-- if the user is signed in, show them their profile -->
    <div v-if="profile">
      <h2 class="title">
        Hello, {{ profile.email }}
      </h2>
      <p class="subtitle">
        User ID: {{ profile.id }}
      </p>
      <b-button
        type="is-primary"
        @click="signOut"
      >
        Sign Out
      </b-button>
    </div>
    <div v-if="submitted">
      <h1 class="title">
        Please check your email to sign in
      </h1>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ProfilePage',
  data: () => ({
    profile: null,
    submitted: false,
    hasError: false,
    email: '',
    error: null,
    user: null
  }),
  async mounted () {
    /* when the component loads, fetch the user's profile */
    this.profile = await this.$supabase.auth.user()
  },
  methods: {
    async signOut () {
      /* signOut deletes the user's session */
      await this.$supabase.auth.signOut()
      this.profile = null
    },
    async signInWithGoogle () {
      const {
        user,
        error
      } = await this.$supabase.auth.signIn({
        provider: 'google'
      })
      this.submitted = true
      this.user = user
      this.error = error
    },
    async signIn () {
      /* signIn sends the user a magic link */
      const { email } = this
      if (!email) {
        return
      }
      const {
        error,
        data
      } = await this.$supabase.auth.signIn({
        email
      })
      this.submitted = true
      this.user = data
      this.error = error
    }
  }
}
</script>
