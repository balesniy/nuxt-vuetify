<template>
  <div class="flex flex-col">
    <h1 class="title">
      Create new post
    </h1>
    <b-field
      label="Title"
      :type="{ 'is-danger': hasError }"
      :message="{ 'Title is required': hasError }"
    >
      <b-input
        v-model="post.title"
        name="title"
        maxlength="30"
        placeholder="My Title"
        required
      />
    </b-field>
    <client-only>
      <vue-simplemde v-model="post.content" />
    </client-only>
    <b-button
      type="button"
      @click="createPost"
    >
      Create Post
    </b-button>
  </div>
</template>

<script>

export default {
  name: 'CreatePostPage',
  data () {
    return {
      hasError: false,
      post: {}
    }
  },
  methods: {
    async createPost () {
      const { title, content } = this.post
      if (!title || !content) { return }
      const user = this.$supabase.auth.user()
      const { data } = await this.$supabase
        .from('posts')
        .insert([
          { title, content, user_id: user.id, user_email: user.email }
        ])
        .single()
      return this.$router.push(`/posts/${data.id}`)
    }
  }
}
</script>
