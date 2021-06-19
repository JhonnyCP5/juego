
document.addEventListener("DOMContentLoaded", () => {

	const NADA = 0,
		roca = 1,
		pera = 2,
		cuadroCafe = 3,
		tamanioSprites = 15,
		paredIzquierda = 4,
		paredDerecha = 5,
		paredArriba = 6,
		paredAbajo = 7;
	let juegoComenzado = false, $canvas = document.querySelector("#canvas");
	class PedazoSerpiente {
		constructor(x = 10, y = 10) {
			this.x = x;
			this.y = x;
		}
	}
	class Juego {
		constructor() {
			
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			
			this.bufferSonidoComerpera = null;
			this.cargarEfectosDeSonido();
			this.teclas = {
				"39": "derecha",
				"37": "izquierda",
				"38": "arriba",
				"40": "abajo"
			};
			this.imagenes = {
				comida: "https://i.ibb.co/34Qhfgg/comida2.png",
				paredIzquierda: "https://i.ibb.co/ZN04WKD/pared.png",
				paredDerecha: "https://i.ibb.co/BcLP1f6/pared-Derecha.png",
				paredArriba: "https://i.ibb.co/ymzt0XC/pared-Abajo.png",
				paredAbajo: "https://i.ibb.co/HdzxhVK/pared-Arriba.png",
				cuadroVerde: "https://i.ibb.co/VpFH38p/gusano.png",
				pera: "https://i.ibb.co/34Qhfgg/comida2.png",
				raton: "https://image.ibb.co/e9jq0m/Greedy_Mouse_sprite.png",
				roca:
					"https://image.ibb.co/e9jq0m/Greedy_Mouse_sprite.png"
			};
			this.contadorImagenes = 0;
			this.imagenesRequeridas = 9;
			this.serpiente = [
				new PedazoSerpiente(),
				new PedazoSerpiente(),
				new PedazoSerpiente()
			];
			this.canvas = $canvas;
			this.canvasCtx = this.canvas.getContext("2d");
			console.log("La anchura:", this.canvas.width);
			console.log("La altura:", this.canvas.height);
			this.longitudX = parseInt(this.canvas.width / tamanioSprites);
			this.longitudY = parseInt(this.canvas.height / tamanioSprites);
			this.matriz = this.obtenerMatrizEscenario(this.longitudY, this.longitudX);
			this.velocidadInicial = 100;
			this.velocidad = 1;
			this.incrementoVelocidad = 0.05;
			this.direcciones = {
				derecha: 1,
				izquierda: 2,
				arriba: 3,
				abajo: 4
			};
			this.siguienteDireccion = this.direcciones.derecha;
			this.direccion = this.direcciones.derecha;
			let dis = this;

			this._imagenes = {};
			for (let i in this.imagenes) {
				this._imagenes[i] = new Image();
				this._imagenes[i].src = this.imagenes[i];
				this._imagenes[i].addEventListener("load", () => {
					dis.contadorImagenes++;
					dis.comprobarSiSeTerminaronDeCargar();
				});
			}

			this.canvas.addEventListener("click", evento => {
				let x = evento.clientX,
					y = evento.clientY,
					tercioXCanvas = this.canvas.width / 3,
					tercioYCanvas = this.canvas.height / 3;
				if (x <= tercioXCanvas && y >= tercioYCanvas && y <= tercioYCanvas * 2) {
					if (
						dis.direccion === dis.direcciones.arriba ||
						dis.direccion === dis.direcciones.abajo
					)
						dis.siguienteDireccion = dis.direcciones.izquierda;
				} else if (
					x >= tercioXCanvas * 2 &&
					x <= tercioXCanvas * 3 &&
					y >= tercioYCanvas &&
					y <= tercioYCanvas * 2
				) {
					if (
						dis.direccion === dis.direcciones.arriba ||
						dis.direccion === dis.direcciones.abajo
					)
						dis.siguienteDireccion = dis.direcciones.derecha;
				} else if (
					x >= tercioXCanvas &&
					x <= tercioXCanvas * 2 &&
					y >= 0 &&
					y <= tercioYCanvas
				) {
					if (
						dis.direccion === dis.direcciones.derecha ||
						dis.direccion === dis.direcciones.izquierda
					)
						dis.siguienteDireccion = dis.direcciones.arriba;
				} else if (
					x >= tercioXCanvas &&
					x <= tercioXCanvas * 2 &&
					y >= tercioYCanvas * 2 &&
					y <= tercioYCanvas * 3
				) {
					if (
						dis.direccion === dis.direcciones.derecha ||
						dis.direccion === dis.direcciones.izquierda
					)
						dis.siguienteDireccion = dis.direcciones.abajo;
				}
			});


			document.addEventListener("keydown", evento => {
				let direccion = this.teclas[evento.keyCode];
				if (direccion) {
					if (
						(this.direccion === this.direcciones.derecha ||
							this.direccion === this.direcciones.izquierda) &&
						(direccion === "arriba" || direccion === "abajo")
					)
						this.siguienteDireccion = this.direcciones[direccion];
					else if (
						(this.direccion === this.direcciones.arriba ||
							this.direccion === this.direcciones.abajo) &&
						(direccion === "derecha" || direccion === "izquierda")
					)
						this.siguienteDireccion = this.direcciones[direccion];
				}
			});

		}
		ponerperaEnAlgunLugar() {
			let x, y;
			do {
				x = Math.floor(Math.random() * (this.longitudX - 2 + 1) + 1);
				y = Math.floor(Math.random() * (this.longitudY - 2 + 1) + 1);
			} while (this.matriz[x][y] !== NADA);
			this.matriz[x][y] = pera;
		}
		agregarPedazo() {
			this.serpiente.push(new PedazoSerpiente());
		}
		dibujarSerpiente() {
			
			this.direccion = this.siguienteDireccion;
			for (let x = this.serpiente.length - 1; x >= 1; x--) {
				this.serpiente[x].x = this.serpiente[x - 1].x;
				this.serpiente[x].y = this.serpiente[x - 1].y;
			}
			switch (this.direccion) {
				case this.direcciones.derecha:
					this.serpiente[0].x++;
					break;
				case this.direcciones.izquierda:
					this.serpiente[0].x--;
					break;
				case this.direcciones.arriba:
					this.serpiente[0].y--;
					break;
				case this.direcciones.abajo:
					this.serpiente[0].y++;
					break;
			}
			
			if (this.colisionaConAlgo()) {
				console.log("A punto de chocar!");
				return false;
			}
			for (let x = this.serpiente.length - 1; x >= 0; x--) {
				this.canvasCtx.drawImage(
					this._imagenes.cuadroVerde,
					this.serpiente[x].x * tamanioSprites,
					this.serpiente[x].y * tamanioSprites,
					tamanioSprites,
					tamanioSprites
				);
			}
			return true;
		}
		comprobarSiSeTerminaronDeCargar() {
			if (this.contadorImagenes === this.imagenesRequeridas) this.reiniciarJuego();
		}
		reiniciarJuego() {
			juegoComenzado = true;
			setTimeout(() => {
				this.ponerperaEnAlgunLugar();
				this.dibujar();
			}, this.velocidadInicial / this.velocidad);
		}
		onperaComida() {
			this.reproducirSonidoDeperaComida();
			this.agregarPedazo();
			this.aumentarVelocidad();
			this.ponerperaEnAlgunLugar();
		}
		aumentarVelocidad() {
			this.velocidad += this.incrementoVelocidad;
		}

		cargarEfectosDeSonido() {
			var context = new AudioContext();
			let peticion = new XMLHttpRequest(),
				_this = this;
			peticion.open('GET', "assets/apple-crunch-16.wav", true);
			peticion.responseType = 'arraybuffer';

			peticion.onload = function () {
				context.decodeAudioData(peticion.response, function (buffer) {
					_this.bufferSonidoComerpera = buffer;
				});
			}
			peticion.send();
		}
		reproducirSonidoDeperaComida() {
			if (this.bufferSonidoComerpera) {
				var context = new AudioContext();
				var source = context.createBufferSource();
				source.buffer = this.bufferSonidoComerpera;
				source.connect(context.destination);
				source.start(0);
			} else {
				console.log("No hay sonido")
			}
		}
		dibujar() {
			let incrementoY = 0,
				incrementoX = 0;
			this.limpiarEscenario();
			this.dibujarMatriz();
			let sePudoDibujarLaSerpiente = this.dibujarSerpiente();
			if (sePudoDibujarLaSerpiente) {
				if (this.matriz[this.serpiente[0].x][this.serpiente[0].y] === pera) {
					this.matriz[this.serpiente[0].x][this.serpiente[0].y] = NADA;
					this.onperaComida();
					setTimeout(() => {
						this.dibujar();
					}, this.velocidadInicial / this.velocidad);
				} else {
					setTimeout(() => {
						this.dibujar();
					}, this.velocidadInicial / this.velocidad);
				}
			} else {
				alert("Pediste Fin del Juego");
				
				window.location.reload();

			}

		}
		colisionaConAlgo() {
			return this.matriz[this.serpiente[0].x][this.serpiente[0].y] === paredAbajo ||
				this.matriz[this.serpiente[0].x][this.serpiente[0].y] === paredArriba ||
				this.matriz[this.serpiente[0].x][this.serpiente[0].y] === paredDerecha ||
				this.matriz[this.serpiente[0].x][this.serpiente[0].y] === paredIzquierda
		}
		obtenerMatrizEscenario(altura = this.longitudY, anchura = this.longitudX) {
			let matriz = [];
			for (let x = 0; x < anchura; x++) {
				matriz.push([]);
				for (let y = 0; y < altura; y++) {
					if (x === 0) matriz[x].push(paredIzquierda);
					else if (x === anchura - 1) matriz[x].push(paredDerecha);
					else if (y === 0) matriz[x].push(paredArriba);
					else if (y === altura - 1) matriz[x].push(paredAbajo);
					else matriz[x].push(NADA);
				}
			}
			return matriz;
		}
		dibujarMatriz() {
			let posicionX = 0,
				posicionY = 0;
			for (let x = 0; x < this.matriz.length; x++) {
				for (let y = 0; y < this.matriz[x].length; y++) {
					switch (this.matriz[x][y]) {
						case roca:
							this.canvasCtx.drawImage(
								this._imagenes.roca,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
						case paredArriba:
							this.canvasCtx.drawImage(
								this._imagenes.paredArriba,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
						case paredAbajo:
							this.canvasCtx.drawImage(
								this._imagenes.paredAbajo,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
						case paredDerecha:
							this.canvasCtx.drawImage(
								this._imagenes.paredDerecha,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
						case paredIzquierda:
							this.canvasCtx.drawImage(
								this._imagenes.paredIzquierda,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
						case pera:
							this.canvasCtx.drawImage(
								this._imagenes.pera,
								x * tamanioSprites,
								y * tamanioSprites,
								tamanioSprites,
								tamanioSprites
							);
							break;
					}
				}
			}
		}
		limpiarEscenario() {
			this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		getStatus() {
			return { matriz: this.matriz, serpiente: this.serpiente };
		}
	}
	$canvas.width = window.innerWidth;
	$canvas.height = window.innerHeight;
	var ctx = $canvas.getContext("2d");
	ctx.font = "20px Verdana";
	ctx.fillStyle = "#ffffff";
	ctx.textAlign = "center";
	ctx.fillText(
		"TOCA LA PANTALLA PARA INICIAR EL JUEGO",
		$canvas.width / 2,
		$canvas.height / 2
	);

	ctx.fillText(
		"TALLER DE SISTEMAS",
		$canvas.width / 2,
		($canvas.height / 2) + 30
	);
	document.addEventListener("keyup", evento => {
		if (evento.keyCode === 13 && !juegoComenzado) new Juego();
	});
	$canvas.addEventListener("click", () => {
		if (!juegoComenzado) new Juego();
	});
});
