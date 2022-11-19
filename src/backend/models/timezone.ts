import timezones from "../database/timezones.json"

export interface Timezone {
  id: string
  offset: number
  offsetName: string
  name: string
  country: string
}

export class TimezoneImp implements Timezone {
  public country: string
  public name: string
  constructor(public id: string) {
    const { city, country } = timezones[id]
    this.country = country
    this.name = city
  }
  get offset() {
    return this.findTimeZoneOffset()
  }
  private findTimeZoneOffset() {
    const date = new Date()
    const [dayStr, timeStr] = date
      .toLocaleTimeString("pt-BR", {
        timeZone: this.id,
        day: "numeric",
      })
      .split(" ")
    const [hoursStr, minutesStr] = timeStr.split(":")
    const day = Number(dayStr)
    const hours = Number(hoursStr)
    const minutes = Number(minutesStr)
    let diffHours = hours - date.getUTCHours()
    if (date.getUTCDate() > day) diffHours -= 24
    if (date.getUTCDate() < day) diffHours += 24
    const diffMinutes = minutes - date.getUTCMinutes()
    const offset = diffHours * 60 + diffMinutes
    return offset
  }
  get offsetName() {
    return this.findTimezoneName()
  }
  private findTimezoneName() {
    const offsetMinutes = this.offset % 60
    const offsetHours = (this.offset - offsetMinutes) / 60
    const formatedHours = offsetHours
      .toString()
      .replace(/(-?)(\d{1,2})/, (_, symbol, number) => {
        if (!symbol) symbol = "+"
        number = number.padStart(2, "0")
        return symbol + number
      })
    const formatedMinutes = Math.abs(offsetMinutes).toString().padStart(2, "0")
    return `GMT${formatedHours}:${formatedMinutes}`
  }
  static convertTime(
    time: string,
    toOffset: number,
    fromOffset: number = -180
  ) {
    let [hoursStr, minutesStr] = time.split(":")
    const hours = Number(hoursStr)
    const minutes = Number(minutesStr)
    const diffOffset = toOffset - fromOffset
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes + diffOffset)
    hoursStr = date.getHours().toString().padStart(2, "0")
    minutesStr = date.getMinutes().toString().padStart(2, "0")
    return `${hoursStr}:${minutesStr}`
  }
}
