"use strict";
// JS Assessment: Find Your Hat //
import promptSync from "prompt-sync";
import clear from "clear-screen";

// สร้าง function prompt สำหรับรับ input จาก user
const prompt = promptSync({ sigint: true });

// กำหนด Symbols ต่าง ๆ บนแผนที่
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

// สร้าง Class Field สำหรับเล่นเกมส์
class Field {
	//Method ที่ทำงานตอนสร้าง object ใหม่จาก class Field โดยรับ parameter ชื่อ field
	constructor(field = [[]]) {
		this.field = field;

		//ใช้เก็บตำแหน่งของผู้เล่น (โดยเราเริ่มเกมที่แถว 0, คอลัมน์ 0)
		this.positionRow = 0; // ตำแหน่งเริ่มต้นแนวตั้ง
		this.positionCol = 0; // ตำแหน่งเริ่มต้นแนวนอน

		//check ว่าเกมจบหรือยัง ถ้า true = stop loop
		this.gameOver = false

		//วาง symbol * แทนตำแหน่งเริ่มต้นของผู้เล่น
		this.field[this.positionRow][this.positionCol] = pathCharacter;
		
	}

    // Method สำหรับ Print field (แสดงผลแผนที่บนหน้าจอ) //
    print() {
		clear(); 
        //แปลงแต่ละแถวของ array ย่อย ให้เป็น string เดียว โดยการ map
		//รวมแต่ละแถวเข้าด้วยกัน ด้วยการขึ้นบรรทัดใหม่ระหว่างแถว \n
		const displayField = this.field.map(row => row.join('')).join('\n');
		console.log(displayField);
	}
	// static method เรียกใช้จาก Field.generateField(...) ใช้สร้าง field ที่สุ่มตำแหน่งของ hole กับ fieldCharacter โดยมีความน่าจะเป็นที่จุดนั้นจะเป็นหลุม (set ค่าเป็น 0.2 / 20%)
    static generateField(height, width, holePercentage = 0.2) {
		
		//สร้าง array 2 มิติ ขนาด height x width สำหรับเก็บแผนที่
        //ใช้ new Array(height) เพื่อ สร้าง array เปล่าที่มีความสูงตาม height 
        //.fill(0) --> เติมค่า 0 ชั่วคราว เพื่อให้ .map(...) ใช้งานได้
        //.map(() --> new Array(width)) → แทนที่แต่ละแถวด้วย array ย่อยที่มีความกว้างเท่ากับ width
		const field = new Array(height).fill(0).map(() => new Array (width));

		//ใช้ loop for ผ่านทุกตำแหน่งใน field และสุ่มว่าจะใส่ "░" (พื้น) หรือ "O" (หลุม)
        //ใช้ Math.random() เพื่อ สุ่มเลข 0 ถึง 1
        //ถ้า prob > holePercentage → ให้ใส่พื้น (fieldCharacter)
        //ถ้า prob <= holePercentage → ใส่หลุม (hole)
		for (let y = 0; y < height; y++) {
		  for (let x = 0; x < width; x++) {
			const prob = Math.random();
			field[y][x] = prob > holePercentage ? fieldCharacter : hole;
		  }
		}
        //สุ่มตำแหน่งของหมวก ^
        //ใช้ Math.random() * width เพื่อสุ่มตำแหน่งแกน x (แนวนอน)
        //ใช้ Math.random() * height เพื่อสุ่มตำแหน่งแกน y (แนวตั้ง)
        //ใช้ Math.floor(...) เพื่อปัดเศษลงให้เป็นเลขจำนวนเต็ม เพราะ index ใน array เป็น จำนวนเต็ม
	    const hatLocation = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height)
		};
		//ใช้ whle เพื่อตรวจสอบไม่ให้ตำแหน่งของหมวกอยู่ที่ [0][0] (ตำแหน่งเริ่มต้นของผู้เล่น)
        //ถ้าหมวกอยู่ที่ [0][0] จะสุ่มใหม่
		while (hatLocation.x === 0 && hatLocation.y === 0){
			hatLocation.x = Math.floor(Math.random() * width);
			hatLocation.y = Math.floor(Math.random() * height);
		}
		//ใส่หมวก (^) ลงในตำแหน่งที่สุ่มได้
		field[hatLocation.y][hatLocation.x] = hat;
		return field; //คืนค่า array 2 มิติที่สร้างเสร็จแล้ว กลับไปใช้ตอนสร้าง field ใหม่ สำหรับเริ่มเกมใหม่หรือเล่นรอบถัดไป
	}


    //Method สำหรับรับค่า input และ move 
	askAndMove() {
		const move = prompt("Which way? (W = up, A = left, S = down, D = right): ").toUpperCase();
        //รับ input จากผู้ใช้ แล้วแปลงให้เป็นตัวพิมพ์ใหญ่ .toUpperCase()
		// ใช้ switch case เพื่อเช็คว่า input คืออะไร แล้วปรับตำแหน่ง row / col
        // W = ขึ้น --> ลดแถว
        // A = ซ้าย --> ลดคอลัมน์
		// S = ลง --> เพิ่มแถว
        // D = ขวา --> เพิ่มคอลัมน์
        // ถ้า input ไม่ใช่ 4 ตัวที่กำหนด → แจ้ง error
		switch (move) {
			case "W":
				this.positionRow -= 1;
				break;
			case "A":
				this.positionCol -=1;
				break;
			case "S":
				this.positionRow += 1;
				break;
			case "D":
				this.positionCol += 1;
				break;
			default:
				console.log("Invalid input. Input W, A, S, D only.");
				return;
		}

		this.checkPosition();
	}
	
	// method สำหรับตรวจสอบสถานะหลังจากขยับ
	checkPosition() {
		//เช็คว่าออกนอกขอบเขตหรือไม่
        //ถ้าแถวหรือลำดับคอลัมน์ < 0 = เดินหลุดขอบซ้ายหรือบน
        //ถ้าเกินขนาดของแผนที่ = เดินหลุดขอบล่างหรือขวา
        //ถ้าใช่ = จบเกมทันที
		if (
			this.positionRow < 0 ||
			this.positionCol < 0 ||
			this.positionRow >= this.field.length ||
			this.positionCol >= this.field[0].length	
		)   {
			console.log("You moved outside the field. Game over! 💣");
		    this.gameOver = true;
		    return;
			}
		
			//ดึงค่า tile (ตัวอักษรที่ตำแหน่งนั้น) มาดูว่าเป็นอะไร
			const tile = this.field[this.positionRow][this.positionCol];

			//ถ้า tile เป็น ^ --> เจอหมวก --> ชนะ
            //ถ้า tile เป็น O --> ตกหลุม --> แพ้
            //ถ้าเป็น ░ --> ปลอดภัย --> เดินต่อได้ --> วาง * ที่ตำแหน่งใหม่
			if (tile === hat) {
				console.log("You found your hat! You win! 🎉");
				this.gameOver = true;
			} else if (tile === hole) {
				console.log("You fell into a hole! Game over! 😓");
				this.gameOver = true;
			} else {
				this.field[this.positionRow][this.positionCol] = pathCharacter;
			}
	}
	// Game Mode ON (method สำหรับเริ่มเกม)
     startGame() {
		// ใช้ ลูป while เพื่อให้เกมเล่นต่อไปเรื่อย ๆ
        // เงื่อนไข !this.gameOver คือถ้า gameOver เป็น false → ยังไม่จบเกม → เล่นต่อ
		while (!this.gameOver) {
			this.print();
			this.askAndMove();
		}
	 }
    //วนลูปเกมไปเรื่อย ๆ จนกว่า this.gameOver จะเป็น true จึงจะจบ
    //ในแต่ละรอบ จะมีการแสดงแผนที่ปัจจุบัน --> รับคำสั่งเดิน --> update ตำแหน่ง --> ตรวจสอบ ---> วนกลับไปใหม่อีกครั้ง ถ้ายังไม่ Game Over
}

//เรียกใช้เกมส์ แบบ static method ชื่อ generateField และใส่ค่า จำนวน row, column, และ hole percentage ใน array
const myfield = new Field(Field.generateField(4, 4, 0.2));
myfield.startGame();

