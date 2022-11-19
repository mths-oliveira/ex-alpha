export function convertTime(
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
