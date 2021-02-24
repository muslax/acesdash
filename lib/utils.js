/*
export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
}
*/

export function pick(obj, ...keys) {
  const ret = {}
  keys.forEach((key) => {
    ret[key] = obj[key]
  })

  return ret
}

const bcrypt = require('bcryptjs')

export function createPassword(username) {
  const chr3 = username.toLowerCase().substr(0,3)
  let array = ('0123456789abcdef0123456789abcdef').split('')
  array.sort(() => Math.random() - 0.5);
  const chr4 = array.join('').substr(-4)
  const password = chr3 + chr4
  const xfpwd = password.split('').reverse().join('')
  const saltRounds = 2;
  const hashed_password = bcrypt.hashSync(password, saltRounds)
  return { password, hashed_password, xfpwd }
}

export function createRandomPassword() {
  const upper = 'ABCDEFGHJKLMNPRSTUVWXYZ'
  const lower = upper.toLocaleLowerCase()
  const nums = '123456789123456789'
  let array = (upper + lower + nums).split('')
  array.sort(() => Math.random() - 0.5);
  const password = array.join('').substr(0, 7)
  const xfpwd = password.split('').reverse().join('')
  const saltRounds = 2;
  const hashed_password = bcrypt.hashSync(password, saltRounds)
  return { password, hashed_password, xfpwd }
}

export function createIndonesiaDate(utcDate) {
  const d = new Date(utcDate)
  if (!utcDate || !d instanceof Date) return false

  const days = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ]
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  const shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agt',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ]

  const tanggal = [
    d.getDate(),
    months[d.getMonth()],
    d.getFullYear()
  ].join(' ')
  const hari = days[d.getDay()]
  const jam = d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
  const menit = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
  const waktu = [jam, menit].join(':')
  return {
    hari, tanggal, waktu
  }
}