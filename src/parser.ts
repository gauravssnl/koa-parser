import { form, json, text } from 'co-body'
import { IncomingForm } from 'formidable'
import * as Koa from 'koa'
import KoaParser from '../types/koa-parser'

const multipart = (ctx: Koa.Context, {
  encoding = 'utf-8'
}: KoaParser.ParserOptions = {}): Promise<KoaParser.Body> => {
  return new Promise((resolve, reject) => {
    const formidable: IncomingForm = new IncomingForm()
    // 设置编码
    formidable.encoding = encoding

    // 存放请求体
    const body: KoaParser.Body = {}

    formidable.on('field', (field, value) => {
      if (body[field]) {
        if (Array.isArray(body[field])) {
          body[field].push(value)
        } else {
          body[field] = [body[field], value]
        }
      } else {
        body[field] = value
      }
    }).on('file', (field, file) => {
      if (body[field]) {
        if (Array.isArray(body[field])) {
          body[field].push(file)
        } else {
          body[field] = [body[field], file]
        }
      } else {
        body[field] = file
      }
    }).on('end', () => {
      return resolve(body)
    }).on('error', err => {
      return reject(err)
    })

    // 执行解析
    formidable.parse(ctx.req)
  })
}

export {
  json,
  multipart,
  text,
  form as urlencoded
}
