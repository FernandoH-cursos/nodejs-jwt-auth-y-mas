import nodemailer, { Transporter } from "nodemailer";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  //? Objeto de configuracion para enviar correo con nodemailer
  private transporter: Transporter;
  
  
  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
  ) {
    //? Configuracion para enviar correo con nodemailer
    this.transporter = nodemailer.createTransport({
      //* Servicio a usar para mails
      service: mailerService,
      //* Autorizacion usando correo donde se envia el mail y su secret key
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
  }

  //? Envia el correo
  async sendEmail({
    to,
    subject,
    htmlBody,
    attachments = [],
  }: SendMailOptions) {
    //* Al enviar el email se pasa el correo(o varios correos) a quien va, el sujeto,
    //* el html del body y opcionalmente un archivo adjunto.
    const mailOptions = {
      to,
      subject,
      html: htmlBody,
      attachments,
    };

    try {
      //* Envia el mail
      const sentInformation = await this.transporter.sendMail(mailOptions);
      // console.log(sentInformation);

      return true;
    } catch (error) {
      return false;
    }
  }

}
