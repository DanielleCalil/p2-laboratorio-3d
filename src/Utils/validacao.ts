const inteiroNaoNegativo = (valor: unknown): valor is number => {
    return typeof valor === "number" && Number.isInteger(valor) &&
        valor >= 0 && valor <= 2147483647;
}

const inteiroPositivo = (valor: unknown): valor is number => {
    return inteiroNaoNegativo(valor) && valor > 0;
}

const idValido = inteiroPositivo;

const textoValido = (valor: unknown): valor is string => {
    return typeof valor === "string" && valor.trim().length > 0 && valor.trim().length <= 191;
}

export { idValido, textoValido, inteiroPositivo, inteiroNaoNegativo };
