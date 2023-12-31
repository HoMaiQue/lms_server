/* eslint-disable no-undef */
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config()
export const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf8')
export const emailConfirmOrder = fs.readFileSync(path.resolve('src/templates/order-confirm.html'), 'utf8')

// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    // eslint-disable-next-line no-undef
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string[] | string
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })

  return sesClient.send(sendEmailCommand)
}

export const sendVerifyEmailRegister = async (
  toAddress: string,
  name: string,
  activationCode: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify Email',
    template.replace('{{name}}', name).replace('{{activationCode}}', activationCode)
    // .replace('{{link}}', `${process.env.CLIENT_URL}/verify-email?token=${email_verify_token}`)
  )
}
export const sendEmailConfirmOrder = async (
  toAddress: string,
  order: { name: string; order_number: string; date: string; course_name: string; quantity: number; price: number },
  template: string = emailConfirmOrder
) => {
  return sendVerifyEmail(
    toAddress,
    'Confirm Order',
    template
      .replace('{{name}}', order.name)
      .replace('{{order_number}}', order.order_number)
      .replace('{{date}}', order.date)
      .replace('{{course_number}}', order.course_name)
      .replace('{{quantity}}', order.quantity.toString())
      .replace('{{price}}', order.price.toString())
  )
}
