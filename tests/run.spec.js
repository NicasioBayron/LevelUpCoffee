import { validRun } from "../src/database.js"

describe("Validacion del RUN", () => {
    it("Acepta run valido", () => {
        const resultado = validRun("12.345.678-5");
        expect(resultado).toBe(true);
    });
    it("Digito verificador invalido (rechaza)", () => {
        const resultado = validRun("12.345.678-9");
        expect(resultado).toBe(false);
    });
    it("Rechaza run invalido (texto)", () => {
        const resultado = validRun("hola");
        expect(resultado).toBe(false);
    });
});