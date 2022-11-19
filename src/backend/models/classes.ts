import { convertTime } from "../../utils/convert-time"
import classes from "../database/classes.json"

interface ClassesData {
  times: number
  weekdays: string
  period: string
  hours: string
}

type ObserverFn = () => void

class Observer {
  private observers: ObserverFn[] = []
  public subscribe(observer: ObserverFn) {
    this.observers.push(observer)
  }
  protected notifyAll() {
    for (const observer of this.observers) {
      observer()
    }
  }
}

const dayPeriods = {
  madrugada: {
    de: "00:00",
    as: "05:59",
  },
  manhã: {
    de: "06:00",
    as: "11:59",
  },
  tarde: {
    de: "12:00",
    as: "17:59",
  },
  noite: {
    de: "18:00",
    as: "23:59",
  },
}

export interface ClassDate {
  name: string
  firstClass: string
  lastClass: string
}

export class Classes extends Observer {
  private timezoneOffset = -180
  data: ClassesData
  constructor() {
    super()
    this.data = {
      times: 0,
      weekdays: "",
      period: "",
      hours: "",
    }
  }
  setTimezoneOffset(timezoneOffset: number) {
    this.timezoneOffset = timezoneOffset
    this.setTimes(0)
  }
  setTimes = (times: number) => {
    this.data.times = times
    if (this.data.weekdays) {
      this.setWeekdays("")
      return
    }
    this.notifyAll()
  }
  setWeekdays = (weekdays: string) => {
    this.data.weekdays = weekdays
    if (this.data.period) {
      this.setPeriod("")
      return
    }
    this.notifyAll()
  }
  setPeriod = (period: string) => {
    this.data.period = period
    if (this.data.hours) {
      this.setHours("")
      return
    }
    this.notifyAll()
  }
  setHours = (hours: string) => {
    this.data.hours = hours
    this.notifyAll()
  }
  get weekdaysString() {
    if (!this.data.weekdays) return ""
    return classes[this.data.weekdays].weekdays
      .map((weekday: string) => {
        if (weekday === "Sábado") return weekday
        return `${weekday}-feira`
      })
      .join(" e ")
  }
  get weekdays() {
    const weekdays = []
    const times = this.data.times
    for (const classId in classes) {
      const classe = classes[classId]
      if (times !== classe.weekdays.length) continue
      weekdays.push(classe.weekdays.join(" e "))
    }
    return weekdays
  }

  private getHours() {
    const hours: string[] =
      classes[this.data.weekdays || "segunda_e_quarta"].hours.sort()
    return hours.map<string>((hour: string) => {
      return convertTime(hour, this.timezoneOffset)
    })
  }
  get hours() {
    let hours = this.getHours()
    if (this.data.period) {
      hours = hours.filter((hour) => {
        const dayPeriod = dayPeriods[this.data.period]
        return hour >= dayPeriod.de && hour < dayPeriod.as
      })
    }
    return hours
  }
  get periods() {
    const periods = {}
    for (const hour of this.getHours()) {
      periods[this.getPeriod(hour)] = 0
    }
    return Object.keys(periods)
  }
  getPeriod(hour: string) {
    for (const period in dayPeriods) {
      const dayPeriod = dayPeriods[period]
      if (dayPeriod.de <= hour && dayPeriod.as > hour) {
        return period
      }
    }
  }
  private findById(id: string): ClassDate {
    const { weekdays, hours } = classes[id]
    return {
      firstClass: hours[0],
      lastClass: hours[hours.length - 1],
      name: weekdays.join(" e "),
    }
  }
  findAll() {
    return Object.keys(classes).map((id) => {
      return this.findById(id)
    })
  }
}
