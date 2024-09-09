import { Especie } from "./classes/animais.js";
import { bioma } from "./classes/biomas.js";
import { Recinto } from "./classes/recintos.js";

// Especies disponíveis enunciados
const especiesDisponiveis = {
    LEAO: new Especie('LEAO', 3, true, [bioma.savana]),
    LEOPARDO: new Especie('LEOPARDO', 2, true, [bioma.savana]),
    CROCODILO: new Especie('CROCODILO', 3, true, [bioma.rio]),
    MACACO: new Especie('MACACO', 1, false, [bioma.savana, bioma.floresta]),
    GAZELA: new Especie('GAZELA', 2, false, [bioma.savana]),
    HIPOPOTAMO: new Especie('HIPOPOTAMO', 4, false, [bioma.savana, bioma.rio]),
}

// Criando recintos do enunciado
const recintosDisponiveis = [
    new Recinto([bioma.savana], 10),
    new Recinto([bioma.floresta], 5),
    new Recinto([bioma.savana, bioma.rio], 7),
    new Recinto([bioma.rio], 8),
    new Recinto([bioma.savana], 9),
]

//Adicionando animais do enunciado
recintosDisponiveis[0].addAnimal(especiesDisponiveis.MACACO, 3)
recintosDisponiveis[2].addAnimal(especiesDisponiveis.GAZELA, 1)
recintosDisponiveis[4].addAnimal(especiesDisponiveis.LEAO, 1)

class RecintosZoo {
    recintosViaveis = []

    analisaRecintos(especie, quantidade) {
        const animal = especiesDisponiveis[especie];
        if (!animal)
            return {
                erro: "Animal inválido",
                recintosViaveis: false
            }

        if (quantidade <= 0)
            return {
                erro: "Quantidade inválida",
                recintosViaveis: false
            }

        // Selecionando biomas adequados
        this.selecionarBiomasAdequados(animal)
        // Selecionando recintos com espaço livre
        this.selecionarRecintosComEspacoLivre(animal, quantidade)
        // Lidando Com Animais Carnívoros
        this.lidandoComAnimaisCarnivoros(animal)
        // Verificando se o animal é hipopótamo, caso for, só pode está em um bioma com savana e rio
        this.verificandoSerOAnimalEhHipopotamo(animal)
        //Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
        this.verificandoSerOAnimalEhMamaco(animal, quantidade)

        // Retorno resultado caso não tiver recintos viáveis
        if (this.recintosViaveis.length === 0)
            return {
                erro: "Não há recinto viável",
                recintosViaveis: false
            }

        // Atribuindo animais ao recinto
        this.recintosViaveis.forEach(recinto => recinto.addAnimal(animal, quantidade))

        return {
            erro: false,
            recintosViaveis: this.recintosViaveis.map(recinto => {
                return `Recinto ${recinto.id} (espaço livre: ${recinto.espacoLivre()} total: ${recinto.tamanhoTotal})`
            })
        }
    }

    selecionarBiomasAdequados(animal) {
        this.recintosViaveis = recintosDisponiveis.filter(recinto =>
            recinto.biomas.some(bioma =>
                animal.biomas.includes(bioma)
            )
        )
    }

    selecionarRecintosComEspacoLivre(animal, quantidade) {
        this.recintosViaveis = this.recintosViaveis.filter(recinto =>
            recinto.espacoLivre() >= animal.tamanho * quantidade
        )
    }

    lidandoComAnimaisCarnivoros(animal) {
        // Implementando a regra de que Animais carnívoros devem habitar somente com a própria espécie
        this.recintosViaveis = this.recintosViaveis.filter(recinto => {
            // Se o recinto estiver vazio então não precisa verificar
            if (recinto.estaVazio()) return true
            // Verificando ser existe algum animal carnivoro caso tiver só podem ter recintos da mesma ou outra espécie
            return recinto.animais.some(animalNoRecinto =>
                // Se alguns dos animais for carnívoro, eles só podem está no mesmo recinto se for da mesma especie.
                animal.carnivoro || animalNoRecinto.carnivoro ? animal.especie === animalNoRecinto.especie : true
            )
        })
    }

    verificandoSerOAnimalEhHipopotamo(animal) {

        if (animal.especie === especiesDisponiveis.HIPOPOTAMO.especie)
            this.recintosViaveis = this.recintosViaveis.filter(recinto => {
                const biomaEhSavanaRio = (recinto.biomas.includes(bioma.rio) && recinto.biomas.includes(bioma.savana))
                return recinto.estaVazio() || biomaEhSavanaRio ? true
                    : recinto.animais.some(animalNoRecinto =>
                        animal.especie === animalNoRecinto.especie
                    )
            })
    }

    verificandoSerOAnimalEhMamaco(animal, quantidade) {
        if (animal.especie === especiesDisponiveis.MACACO.especie)
            this.recintosViaveis = this.recintosViaveis.filter(recinto =>
                recinto.quantidadeDeAnimais() > 0 || quantidade > 1 ? true : null
            )
    }
}

export { RecintosZoo as RecintosZoo };