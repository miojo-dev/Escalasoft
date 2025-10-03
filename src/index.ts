import * as fs from "fs";

namespace banco {

    //-----tipo para notas-----
    type Notas = {
        dois: number,
        cinco: number,
        dez: number,
        vinte: number,
        cinquenta: number,
        cem: number,
        duzentos: number
    };

    //-----interface para notificar-----
    export interface Notificar {
        Registrar(mensagem: string): void;
    }

    // ---- Implementação que grava em arquivo ----
    class ArquivoNotificador implements Notificar {
        private caminho: string;

        public constructor(caminho: string = "notificacoes.txt") {
            this.caminho = caminho;
            if (!fs.existsSync(caminho)) {
                fs.writeFileSync(caminho, "Notificações:\n");
            }
        }

        public Registrar(mensagem: string): void {
            //quando aconteceu
            const quando: string = new Date().toLocaleString("pt-BR");

            //grava no arquivo
            fs.appendFileSync(this.caminho, `[${quando}] ${mensagem}\n`);
        }
    }

    //-----classe principal Caixa-----
    export class Caixa {
        private cedulas: Notas;
        private notificador: Notificar[] = [];

        public constructor() {
            //inicio vazio
            this.cedulas = {
                dois: 0,
                cinco: 0,
                dez: 0,
                vinte: 0,
                cinquenta: 0,
                cem: 0,
                duzentos: 0
            }
        }

        public AddNotificador(notificador: Notificar): void {
            this.notificador.push(notificador);
        }

        private Notificacao(msg: string): void {
            //Registra as notificacoes
            for (const n of this.notificador) {
                n.Registrar(msg);
            }
            console.log(msg);
        }

        public GetTotal(): number {
            //Soma e retorna o total disponivel
            return (
                this.cedulas.dois * 2 +
                this.cedulas.cinco * 5 +
                this.cedulas.dez * 10 +
                this.cedulas.vinte * 20 +
                this.cedulas.cinquenta * 50 +
                this.cedulas.cem * 100 +
                this.cedulas.duzentos * 200
            );
        }

        //Deposita notas individualmente
        public Depositar(notas: Partial<Notas>): void {
            if (notas.dois) {
                this.cedulas.dois += notas.dois
            }
            if (notas.cinco) {
                this.cedulas.cinco += notas.cinco
            }
            if (notas.dez) {
                this.cedulas.dez += notas.dez
            }
            if (notas.vinte) {
                this.cedulas.vinte += notas.vinte
            }
            if (notas.cinquenta) {
                this.cedulas.cinquenta += notas.cinquenta
            }
            if (notas.cem) {
                this.cedulas.cem += notas.cem
            }
            if (notas.duzentos) {
                this.cedulas.duzentos += notas.duzentos
            }

            this.Notificacao(
                `Depósito realizado com sucesso. 
                Total disponível: R$${this.GetTotal()}`
            );
        }

        public Sacar(valor: number): Partial<Notas> | string {
            const total: number = this.GetTotal();
            if (valor > total) {
                const msg = `Erro: saldo insuficiente para R$${valor}`;
                this.Notificacao(msg);
                return msg;
            }

            const notasUsadas: Notas = {
                dois: 0, cinco: 0, dez: 0, vinte: 0,
                cinquenta: 0, cem: 0, duzentos: 0
            };

            let restante: number = valor;
            const valores: number[] = [200, 100, 50, 20, 10, 5, 2];

            for (const val of valores) {
                const nome: keyof Notas = this.GetNomeNota(val);
                while (restante >= val && this.cedulas[nome] > 0) {
                    restante -= val;
                    this.cedulas[nome]--;
                    notasUsadas[nome]++;
                }
            }

            if (restante === 0) {
                this.Notificacao(`Saque realizado: R$${valor}`);
                return notasUsadas;
            } else {
                //Desfaz movimentação se não deu certo
                this.Depositar(notasUsadas);

                if (valor <= total) {
                    // ITEM 4: saldo suficiente mas impossível compor
                    const sugestao: number | null = this.Sugerir(valor);
                    const msg: string = sugestao
                        ? `Erro: não é possível montar R$${valor}. Sugestão: saque R$${sugestao}`
                        : `Erro: não é possível montar R$${valor} com as cédulas disponíveis.`;
                    this.Notificacao(msg);
                    return msg;
                }

                const msg = `Erro: não foi possível atender ao saque de R$${valor}`;
                this.Notificacao(msg);
                return msg;
            }
        }

        private GetNomeNota(valor: number): keyof Notas {
            switch (valor) {
                case 2:
                    return "dois";
                case 5:
                    return "cinco";
                case 10:
                    return "dez";
                case 20:
                    return "vinte";
                case 50:
                    return "cinquenta";
                case 100:
                    return "cem";
                case 200:
                    return "duzentos";
                default:
                    throw new Error("Nota inválida");
            }
        }

        // Simula se é possível montar um valor sem gastar estoque real
        private PodeMontar(valor: number): boolean {
            let restante: number = valor;
            const valores: number[] = [200, 100, 50, 20, 10, 5, 2];
            for (const val of valores) {
                const nome: keyof Notas = this.GetNomeNota(val);
                const max: number = Math.min(Math.floor(restante / val), this.cedulas[nome]);
                restante -= max * val;
            }
            return restante === 0;
        }

        //Sugestão: procura valor menor que ainda dá pra sacar
        private Sugerir(valor: number): number | null {
            for (
                let v: number = valor - 1;
                v >= 2;
                v--
            ) {
                if (this.PodeMontar(v)) {
                    return v;
                }
            }
            return null;
        }
    }
}

