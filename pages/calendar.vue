<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-toolbar
        flat
      >
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
        >
          Today
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="$refs.calendar.prev()"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="$refs.calendar.next()"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-dialog
        v-model="overlay"
        transition="dialog-top-transition"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Have a key?
          </v-card-title>
          <v-card-text>{{ isOpen.interval }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="overlay = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="open"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-calendar
        ref="calendar"
        v-model="value"
        type="day"
        :hide-header="true"
        locale="it"
        :interval-minutes="60"
        :first-interval="12"
        :interval-count="12"
        :interval-height="60"
        :interval-style="getIntervalStyle"
        :show-interval-label="showInterval"
        :interval-format="intervalFormat"
        :events="events"
        event-overlap-mode="stack"
        :event-overlap-threshold="30"
        @click:interval="onClickInterval"
        @click:time="onClickInterval"
      >
        <template #event="{event}">
          <div class="pl-2 pt-1">
            <v-avatar
              size="36"
              @click.stop="onAvatarClick"
            >
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              >
            </v-avatar>
            <p>{{ event.name }}</p>
          </div>
        </template>
      </v-calendar>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      isOpen: {
        afternoon: false,
        evening: false,
        interval: ''
      },
      overlay: false
    }
  },
  methods: {
    setToday() {
      this.value = ''
    },
    getIntervalStyle({hour}) {
      const isClosed = [12, 13, 14, 20].includes(hour);
      const isEvening = hour >= 21;
      const isAfternoon = hour >= 15 && !isEvening;
      const isOpen = (isEvening && this.isOpen.evening) || (isAfternoon && this.isOpen.afternoon);
      return {
        backgroundColor: isClosed ? 'darkgrey' : isOpen ? 'lightgreen' : 'lightgrey',
      }
    },
    intervalFormat({hour}) {
      return `*${hour}`
    },
    showInterval({hour}) {
      return (hour % 2)
    },
    getEvents({start, end}) {
      const events = []

      const min = new Date(`${start.date}T12:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    onClickInterval({date, hour}) {
      const first = new Date(`${date}T${hour}:00`)
      const second = new Date(first.getTime() + 60 * 60 * 1000)
      this.events.unshift({
        name: this.names[this.rnd(0, this.names.length - 1)],
        start: first,
        end: second,
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        timed: true,
      })
      const isEvening = hour >= 21;
      const isAfternoon = hour >= 15 && !isEvening;
      const firstOpen = (isEvening && !this.isOpen.evening) || (isAfternoon && !this.isOpen.afternoon);
      if (firstOpen) {
        this.isOpen.interval = isEvening ? 'evening' : 'afternoon'
        this.overlay = true;
      }
    },
    open() {
      this.isOpen[this.isOpen.interval] = true;
      this.overlay = false
      this.isOpen.interval = ''
    },
    onAvatarClick(){
      console.log('my name is')
    }
  },
}
</script>
