"use strict";
// JS Assessment: Find Your Hat //
import promptSync from "prompt-sync";
import clear from "clear-screen";

// สร้างฟังก์ชัน prompt สำหรับรับ input จาก user
const prompt = promptSync({ sigint: true });

// กำหนด Symbols ต่าง ๆ บนแผนที่
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

// สร้าง Class Field สำหรับเล่นเกมส์
class Field {
	//Method ที่ทำงานตอนสร้าง object ใหม่จากคลาส Field โดยรับ parameter ชื่อ field
	constructor(field = [[]]) {
		this.field = field;

		//ใช้เก็บตำแหน่งของผู้เล่น (โดยเราเริ่มเกมที่แถว 0, คอลัมน์ 0)
		this.positionRow = 0; // ตำแหน่งเริ่มต้นแนวตั้ง
		this.positionCol = 0; // ตำแหน่งเริ่มต้นแนวนอน

		//check ว่าเกมจบหรือยัง ถ้า true = stop loop
		this.gameOver = false

		//วางสัญลักษณ์ * แทนตำแหน่งเริ่มต้นของผู้เล่น
		this.field[this.positionRow][this.positionCol] = pathCharacter;
		
	}

    // Method สำหรับ Print field //
    print() {
		clear(); // เคลียร์หน้าจอ
		this.field.forEach((row) => {
			console.log(row.join("")); // แสดงแต่ละแถวในแผนที่
		});
	}

    //Method สำหรับรับค่า input และ move 
	askAndMove() {
		const move = prompt("Which way? (W = up, A = left, S = down, D = right): ").toUpperCase();
        //รับ input จากผู้ใช้ แล้วแปลงให้เป็นตัวพิมพ์ใหญ่ .toUpperCase()
		// ใช้ switch เช็คว่า input คืออะไร แล้วปรับตำแหน่ง row / col
        // W = ขึ้น --> ลดแถว
        // S = ลง --> เพิ่มแถว
        // A = ซ้าย --> ลดคอลัมน์
        // D = ขวา --> เพิ่มคอลัมน์
        // ถ้า input ไม่ใช่ตัวที่กำหนด → แจ้ง error
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
		// เช็คว่าออกนอกขอบเขตหรือไม่
        //ถ้าแถวหรือลำดับคอลัมน์ < 0 = เดินหลุดซ้าย/บน
        //ถ้าเกินขนาดของแผนที่ = เดินหลุดล่าง/ขวา
        //ถ้าใช่ → จบเกมทันที
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
		while (!this.gameOver) {
			this.print();
			this.askAndMove();
		}
	 }
    //วนลูปเกมไปเรื่อย ๆ จนกว่า this.gameOver จะเป็น true
    //ในแต่ละรอบ: แสดงแผนที่ --> รับคำสั่งเดิน --> ตรวจสอบ
}

const newGame = new Field([
	["░", "░", "O"],
	["░", "O", "░"],
	["░", "^", "░"],
]);

newGame.startGame(); // เรียกใช้เกม