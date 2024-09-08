class RecintosZoo {
    biomas = {
        rio: 'rio',
        savana: 'savana',
        floresta: 'floresta',
    }

    animais = {
        LEAO: {
            especie: 'leão',
            tamanho: 3,
            bioma: [this.biomas.savana],
            carnivoro: true
        },
        LEOPARDO: {
            especie: 'leopardo',
            tamanho: 2,
            bioma: [this.biomas.savana],
            carnivoro: true
        },
        CROCODILO: {
            especie: 'crocodilo',
            tamanho: 3,
            bioma: [this.biomas.rio],
            carnivoro: true
        },
        MACACO: {
            especie: 'macaco',
            tamanho: 1,
            bioma: [this.biomas.savana, this.biomas.floresta],
            carnivoro: false,
        },
        GAZELA: {
            especie: 'gazela',
            tamanho: 2,
            bioma: [this.biomas.savana],
            carnivoro: false
        },
        HIPOPOTAMO: {
            especie: 'hipopotamo',
            tamanho: 4,
            bioma: [this.biomas.savana, this.biomas.rio],
            carnivoro: false
        }
    }

    recintos = [{
        numero: 1,
        bioma: [this.biomas.savana],
        tamanhoTotal: 10,
        animaisExistentes: [this.animais.MACACO, this.animais.MACACO, this.animais.MACACO],
        temDiferenteEspecies: false
    },
    {
        numero: 2,
        bioma: [this.biomas.floresta],
        tamanhoTotal: 5,
        animaisExistentes: [],
        temDiferenteEspecies: false
    },
    {
        numero: 3,
        bioma: [this.biomas.savana, this.biomas.rio],
        tamanhoTotal: 7,
        animaisExistentes: [this.animais.GAZELA],
        temDiferenteEspecies: false
    },
    {
        numero: 4,
        bioma: [this.biomas.rio],
        tamanhoTotal: 8,
        animaisExistentes: [],
        temDiferenteEspecies: false
    },
    {
        numero: 5,
        bioma: [this.biomas.savana],
        tamanhoTotal: 9,
        animaisExistentes: [this.animais.LEAO],
        temDiferenteEspecies: false
    }

    ]

    analisaRecintos(animalInput, quantidade) {
        const animal = this.animais[animalInput]
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

        let recintosViaveis = [];

        // Selecionando biomas adequados
        recintosViaveis = this.recintos.filter(recinto =>
            recinto.bioma.some(bioma =>
                animal.bioma.includes(bioma)
            )
        )

        // Selecionando recintos com espaço livre
        recintosViaveis = recintosViaveis.filter(recinto => {
            const espacoOcupado = recinto.animaisExistentes.reduce((acc, animalExistente) => acc + animalExistente.tamanho, 0)
            return recinto.tamanhoTotal - espacoOcupado >= animal.tamanho * quantidade
        })

        // Implementando a regra de que Animais carnívoros devem habitar somente com a própria espécie
        recintosViaveis = recintosViaveis.filter(recintos => {
            // Se o recinto estiver vazio então não precisa verificar
            if (recintos.animaisExistentes.length === 0) return true
            // Verificando ser existe algum animal carnivoro caso tiver só podem ter recintos da mesma ou outra espécie
            return recintos.animaisExistentes.some(animalExistente =>
                animalExistente.carnivoro || animal.carnivoro ? animalExistente.especie === animal.especie : true
            )
        })

        // Verificando se o animal é hipopotamo, caso for, só pode está em um bioma com savana e rio
        if (animal.especie === this.animais.HIPOPOTAMO.especie)
            recintosViaveis = recintosViaveis.filter(recinto => {
                const recintoEstaVazio = recinto.animaisExistentes.length
                    === 0
                const biomaEhSavanaRio = (recinto.bioma.includes(biomas.rio) && recinto.bioma.includes(biomas.savana))

                if (recintoEstaVazio || biomaEhSavanaRio) return true
                return recinto.animaisExistentes.some(animalExistente =>
                    animalExistente.especie === animal.especie
                )
            })

        //Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
        if (animal.especie === this.animais.MACACO.especie)
            recintosViaveis = recintosViaveis.filter(recinto => {
                const quantidadeDeAnimaisRecinto = recinto.animaisExistentes.length
                if (quantidadeDeAnimaisRecinto > 0 || quantidade > 1) return true
            }
            )

        // Retorno resultado caso não tiver recintos viáveis
        if (recintosViaveis.length === 0)
            return {
                erro: "Não há recinto viável",
                recintosViaveis: false
            }

        // Atribuindo animais ao recinto
        recintosViaveis.forEach(recinto => {
            for (let i = 0; i < quantidade; i++)
                recinto.animaisExistentes.push(animal)
        })

        // Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
        if (recintosViaveis.length > 1)
            recintosViaveis.forEach(recinto => {
                const primeiroAnimal = recinto.animaisExistentes[0]
                for (let i = 1; i < recinto.animaisExistentes.length; i++)
                    primeiroAnimal.especie !== recinto.animaisExistentes[i].especie ? recinto.temDiferenteEspecies = true : null

                return recinto
            })


        return {
            erro: false,
            recintosViaveis: recintosViaveis.map(recinto => {
                const quantidadeDeAnimaisRecinto = recinto.animaisExistentes.reduce((acc, especie) => acc + especie.tamanho, 0) + (recinto.temDiferenteEspecies ? 1 : 0)

                return `Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - quantidadeDeAnimaisRecinto} total: ${recinto.tamanhoTotal})`
            })
        }
    }
}

export { RecintosZoo as RecintosZoo };
