import classes from "../database/classes.json"
import { TimezoneImp } from "../models/timezone"

interface Class {
  name: string
  firstHour: string
  lastHour: string
}

export type DayPeriod = "manhã" | "tarde" | "noite" | "madrugada"
export type Weekday = "Segunda e Quarta" | "Terça e Quinta" | "Sexta" | "Sábado"
export type ClassName =
  | "segunda_e_quarta"
  | "terca_e_quinta"
  | "sexta"
  | "sabado"

const dayPeriods = {
  madrugada: {
    from: "00:00",
    to: "05:59",
  },
  manhã: {
    from: "06:00",
    to: "11:59",
  },
  tarde: {
    from: "12:00",
    to: "17:59",
  },
  noite: {
    from: "18:00",
    to: "23:59",
  },
}

const weekdayNames = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domigo",
]

interface WeekdayData {
  className: ClassName
  weekday: Weekday
}

export class ClassesController {
  private offset = -180
  private times: number
  private dayPeriod: DayPeriod
  className: ClassName
  setOffset(offset: number) {
    this.offset = offset
  }
  setTimes(times: number) {
    this.times = times
  }
  setClassName(className: ClassName) {
    this.className = className
  }
  setDayPeriod(dayPeriod: DayPeriod) {
    this.dayPeriod = dayPeriod
  }
  findWeekdaysByTimes() {
    const weekdays: WeekdayData[] = []
    const dayPeriods: DayPeriod[] = []
    if (this.offset >= -120) dayPeriods.push("madrugada")
    if (this.offset >= 240) dayPeriods.push("manhã")
    if (this.offset >= 600) dayPeriods.push("tarde")
    for (const className in classes) {
      let days = classes[className].weekdays
      if (days.length === this.times) {
        if (dayPeriods.includes(this.dayPeriod)) {
          days = days.map((day: string) => {
            const index = weekdayNames.indexOf(day)
            return weekdayNames[index + 1]
          })
        }
        const weekday = days.join(" e ")
        weekdays.push({
          className,
          weekday,
        } as WeekdayData)
      }
    }
    return weekdays
  }
  findDayPeriodsByClassName() {
    const dayPeriodsData = []
    for (const hour of this.findHoursByClassName()) {
      const dayPeriod = this.findDayPeriodByHour(hour)
      if (dayPeriodsData.includes(dayPeriod)) continue
      dayPeriodsData.push(dayPeriod)
    }
    return dayPeriodsData
  }
  findDayPeriodByHour(hour: string) {
    for (const dayPeriod in dayPeriods) {
      const { from, to } = dayPeriods[dayPeriod]
      if (hour >= from && hour < to) return dayPeriod
    }
  }
  findWeekdayByClassName() {
    if (!this.className) return ""
    return classes[this.className].weekdays.join(" e ")
  }
  findHoursByDayPeriod() {
    const hours = this.findHoursByClassName()
    if (!this.dayPeriod) return []
    const { from, to } = dayPeriods[this.dayPeriod]
    return hours.filter((hour) => {
      return hour >= from && hour < to
    })
  }
  private findHoursByClassName() {
    if (!this.className) return []
    return classes[this.className].hours.map((time) => {
      return TimezoneImp.convertTime(time, this.offset)
    })
  }
  findAllClasses() {
    return Object.keys(classes).map(this.findClassByClassName)
  }
  findClassByClassName = (className: ClassName) => {
    const { hours, weekdays } = classes[className]
    const name = weekdays.join(" e ")
    const firstHour = TimezoneImp.convertTime(hours[0], this.offset)
    const lastHour = TimezoneImp.convertTime(
      hours[hours.length - 1],
      this.offset
    )
    return {
      name,
      firstHour,
      lastHour,
    }
  }
}
