/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./modules/auth/dto/register.dto"), { "RegisterDto": { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 6 } } }], [import("./modules/auth/dto/confirm-code.dto"), { "ConfirmDto": { email: { required: true, type: () => String, format: "email" }, code: { required: true, type: () => String } } }]], "controllers": [[import("./modules/auth/auth.controller"), { "AuthController": { "register": {}, "confirm": {} } }]] } };
};