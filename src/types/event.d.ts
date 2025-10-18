interface Event{
  title: string,
  description:string,
  type: string,
  date: Date,
  duration: string,
  location: string,
  responsible: string,
  notes?:string,
  link?:string,
  ability?: number,
}