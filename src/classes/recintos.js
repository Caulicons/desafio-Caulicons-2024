export class Recinto {

  constructor(id, biomas, tamanhoTotal) {
    this.id = id++
    this.biomas = biomas
    this.tamanhoTotal = tamanhoTotal
    this.animais = []
  }

  addAnimal(animal, quantidade) {
    for (let i = 0; i < quantidade; i++)
      this.animais.push(animal)
  }

  estaVazio() {
    return this.animais.length === 0
  }

  quantidadeDeAnimais() {
    return this.animais.length
  }

  espacoOcupado() {
    // Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
    let espacoOcupado = this.animais.reduce((acc, animal) => acc + animal.tamanho, 0)

    const primeiroAnimal = this.animais[0]
    for (let i = 0; i < this.animais.length; i++)
      if (primeiroAnimal.especie !== this.animais[i].especie) {
        espacoOcupado++
        break
      }
    return espacoOcupado
  }

  espacoLivre() {
    return this.tamanhoTotal - this.espacoOcupado()
  }
}


