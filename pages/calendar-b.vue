<template>
  <main>
    <pre>{{ error }}</pre>
    <section class="section">
      <ul>
        <li v-for="meeting in meetings" :key="meeting.id">
          <p>{{ new Date(meeting.start_time).toLocaleDateString() }}</p>
          <p>{{ meeting.profiles.username }} {{ new Date(meeting.start_time).toLocaleTimeString() }}</p>
        </li>
      </ul>
    </section>
    <section class="section">
      <form @submit.prevent="onSubmit">
        <b-field>
          <b-checkbox v-model="openIt">
            Open It!
          </b-checkbox>
        </b-field>
        <b-field label="Select datetime from">
          <b-datetimepicker
            v-model="startTime"
            placeholder="Click to select..."
            :min-datetime="new Date()"
          />
        </b-field>
        <b-field label="Select datetime to">
          <b-datetimepicker
            v-model="endTime"
            placeholder="Click to select..."
            :min-datetime="new Date()"
          />
        </b-field>
        <b-button native-type="submit" :disabled="!profile" expanded>
          Submit
        </b-button>
      </form>
    </section>
  </main>
</template>
<script>
export default {
  name: 'CalendarPage',
  data () {
    return {
      loaded: false,
      meetings: [],
      error: null,
      startTime: new Date(),
      endTime: new Date(),
      openIt: false,
      profile: null
    }
  },
  created () {
    this.fetchMeetings()
  },
  async mounted () {
    this.profile = await this.$supabase.auth.user()
  },
  methods: {
    async fetchMeetings () {
      this.loaded = false
      const {
        data: meetings,
        error
      } = await this.$supabase
        .from('meetings')
        .select('*, profiles (username)')
        .gt('start_time', new Date().toDateString())
      this.meetings = meetings
      this.error = error
      this.loaded = true
    },
    async onSubmit () {
      const { error } = await this.$supabase
        .from('meetings').insert([
          {
            start_time: this.startTime,
            end_time: this.endTime,
            open_it: this.openIt,
            user_id: this.profile.id
          }
        ])
      this.error = error
      await this.fetchMeetings()
      if (!error) {
        this.startTime = new Date()
        this.endTime = new Date()
      }
    }
  }
}
</script>
