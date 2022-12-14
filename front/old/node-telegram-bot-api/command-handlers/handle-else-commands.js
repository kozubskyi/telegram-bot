const axios = require('axios')
const { DB_BASE_URL } = process.env
const { SWEET_CHAT_ID } = require('../helpers/variables')

function separateFirstWord(msg) {
  const msgArr = msg.split(' ')
  const cmd = msgArr[0]
  const text = msgArr.slice(1).join(' ')

  return [cmd, text]
}

async function handleCreatorCommands(bot, command) {
  let response = ''

  const [adminCommand, rest] = separateFirstWord(command)

  if (adminCommand === 'add') {
    const [type, statusAndText] = separateFirstWord(rest)
    const [status, text] = separateFirstWord(statusAndText)

    const statuses = {
      sweet: ['sweet'],
      creator: ['creator'],
      others: ['others'],
      'not-sweet': ['creator', 'others'],
      'not-creator': ['sweet', 'others'],
      'not-others': ['sweet', 'creator'],
      all: ['sweet', 'creator', 'others'],
    }

    const resp = await axios.post(`${DB_BASE_URL}/messages`, { type, for: statuses[status], text })

    response = `✅ Повідомлення додано в базу даних: ${JSON.stringify(resp.data)}`
  }
  // else if (adminCommand === 'addmessages') {
  //   await axios.post(`${DB_BASE_URL}/messages/all`, JSON.parse(rest))

  //   response = '✅ Всі компліментики додано в базу даних'
  // }
  else if (adminCommand === 'show') {
    const [collection, id] = separateFirstWord(rest)

    const resp = await axios.get(`${DB_BASE_URL}/${collection}s/${id}`)

    response = JSON.stringify(resp.data)
  } else if (adminCommand === 'del') {
    const [key, idOrText] = separateFirstWord(rest)

    const resp = await axios.delete(`${DB_BASE_URL}/messages/${key}/${idOrText}`)
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      response = `✅ Повідомлення видалено з бази даних: ${JSON.stringify(resp.data)}`
    } else {
      response = 'ℹ️ Такого повідомлення і не було в базі даних'
    }
  } else if (adminCommand === 'upd') {
    const [id, fieldAndNewValue] = separateFirstWord(rest)
    const [field, newValue] = separateFirstWord(fieldAndNewValue)

    const resp = await axios.patch(`${DB_BASE_URL}/messages/${id}`, { [field]: JSON.parse(newValue) })
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      response = `✅ Повідомлення оновлено у базі даних: ${JSON.stringify(resp.data)}`
    } else {
      response = '⚠️ Повідомлення з таким id немає в базі даних'
    }
  } else if (adminCommand === 'mlr') {
    await bot.sendMessage(SWEET_CHAT_ID, rest)
    response = '✅ Повідомлення відправлено'
  } else if (adminCommand === 'msg') {
    const [name, surnameAndText] = separateFirstWord(rest)
    const [surname, text] = separateFirstWord(surnameAndText)

    const { data } = await axios.get(`${DB_BASE_URL}/users/${name}/${surname}`)

    if (data) {
      await bot.sendMessage(data.chatId, text)
      response = '✅ Повідомлення відправлено'
    } else {
      response = '⚠️ Такого користувача немає у базі даних'
    }
  } else if (command === 'delallmessages') {
    await axios.delete(`${DB_BASE_URL}/messages`)

    response = '✅ Всі компліментики видалено з бази даних'
  } else if (command === '/users') {
    const resp = await axios.get(`${DB_BASE_URL}/users`)

    response = JSON.stringify(resp.data.map(({ _id, firstName, lastName }) => `${_id} - ${firstName} ${lastName}`))
  } else if (command === '/messages') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`)

    response = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`))
  } else if (command === '/compliments') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/type/compliment`)

    response = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`))
  } else if (command === '/wishes') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/type/wish`)

    response = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`))
  } else if (command === '/usersq') {
    const resp = await axios.get(`${DB_BASE_URL}/users`)

    response = resp.data.length
  } else if (command === '/messagesq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`)

    response = resp.data.length
  } else if (command === '/complimentsq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`)

    response = resp.data.length
  } else if (command === '/wishesq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/wish`)

    response = resp.data.length
  } else if (command === '/resetsendings') {
    const resp = await axios.patch(`${DB_BASE_URL}/messages/reset/sendings`)

    response = '✅ Поле sendings усіх повідомлень успішно скинуто до 0'
  } else if (command === '/test') {
    response = '✅'
  } else {
    response = '⚠️ Некоректна команда'
  }

  return response
}

module.exports = async function handleElseCommands(bot, status, command) {
  let response = ''

  if (status === 'sweet') {
    response = 'Я передам Денису те, що ти написала) 😘'
  } else if (status === 'creator') {
    response = await handleCreatorCommands(bot, command)
  } else {
    response = 'Я передам Денису це повідомлення 😉'
  }

  return { response }
}
