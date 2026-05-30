// ============================================
// 스마트폰 OOP 클래스 계층 (과제1 Python → JavaScript 변환)
// ============================================

// 단계 1: 추상 클래스 (ADT) - JavaScript에서는 에러를 던져 추상화 시뮬레이션
class SmartphoneADT {
  get model() {
    throw new Error("추상 프로퍼티: 하위 클래스에서 구현해야 합니다.");
  }
  get screenSize() {
    throw new Error("추상 프로퍼티: 하위 클래스에서 구현해야 합니다.");
  }
  get durability() {
    throw new Error("추상 프로퍼티: 하위 클래스에서 구현해야 합니다.");
  }
  useScreen() {
    throw new Error("추상 메서드: 하위 클래스에서 구현해야 합니다.");
  }
  putInPocket() {
    throw new Error("추상 메서드: 하위 클래스에서 구현해야 합니다.");
  }
  charge(amount) {
    throw new Error("추상 메서드: 하위 클래스에서 구현해야 합니다.");
  }
}

// 단계 2: 기본 클래스 (Base Class)
class Smartphone extends SmartphoneADT {
  #battery; // private 필드 (Python의 __battery 대응)

  constructor(model, screenSize, battery, weight, durability) {
    super();
    this._model = model;
    this._screenSize = screenSize;
    this.#battery = battery;
    this._weight = weight;
    this._durability = durability;
  }

  get model() {
    return this._model;
  }

  get screenSize() {
    return this._screenSize;
  }

  get durability() {
    return this._durability;
  }

  get battery() {
    return this.#battery;
  }

  set battery(value) {
    if (value < 0) this.#battery = 0;
    else if (value > 100) this.#battery = 100;
    else this.#battery = value;
  }

  get weight() {
    return this._weight;
  }

  useScreen() {
    return `[${this.model}] ${this.screenSize}인치 화면을 사용합니다.`;
  }

  putInPocket() {
    return `[${this.model}] 스마트폰을 주머니에 넣습니다.`;
  }

  charge(amount) {
    this.battery = this.battery + amount;
    return `[${this.model}] 배터리를 ${amount}% 충전했습니다. 현재 배터리: ${this.battery}%`;
  }

  toString() {
    return `${this.model} | 화면: ${this.screenSize}인치 | 배터리: ${this.battery}% | 무게: ${this._weight}g | 내구도: ${this.durability}/100`;
  }

  // 클래스 타입 이름 반환
  get typeName() {
    return "Smartphone";
  }
}

// 단계 3-1: 하위 클래스 - BarPhone (일반 스마트폰)
class BarPhone extends Smartphone {
  constructor(model, screenSize, battery, weight, durability) {
    super(model, screenSize, battery, weight, durability);
  }

  useScreen() {
    return `[${this.model}] ${this.screenSize}인치 고정 화면을 사용합니다.`;
  }

  putInPocket() {
    return `[${this.model}] ${this.screenSize}인치 그대로 주머니에 넣습니다.`;
  }

  charge(amount) {
    this.battery = this.battery + amount;
    return `[${this.model}] 단일 배터리 충전 완료. 현재 배터리: ${this.battery}%`;
  }

  get typeName() {
    return "BarPhone";
  }
}

// 단계 3-2: 하위 클래스 - FoldablePhone (폴더블 스마트폰)
class FoldablePhone extends Smartphone {
  constructor(model, coverSize, mainSize, battery, weight, durability) {
    super(model, coverSize, battery, weight, durability);
    this._mainSize = mainSize;
    this._coverSize = coverSize;
    this._isFolded = true;
  }

  get screenSize() {
    return this._isFolded ? this._coverSize : this._mainSize;
  }

  get mainSize() {
    return this._mainSize;
  }

  get coverSize() {
    return this._coverSize;
  }

  get isFolded() {
    return this._isFolded;
  }

  fold() {
    if (this._isFolded) {
      return `[${this.model}] 이미 접혀 있습니다.`;
    }
    this._isFolded = true;
    return `[${this.model}] 화면을 접었습니다. 현재 화면: ${this.screenSize}인치`;
  }

  unfold() {
    if (!this._isFolded) {
      return `[${this.model}] 이미 펼쳐져 있습니다.`;
    }
    this._isFolded = false;
    return `[${this.model}] 화면을 펼쳤습니다. 현재 화면: ${this.screenSize}인치`;
  }

  useScreen() {
    if (this._isFolded) {
      return `[${this.model}] 커버 화면 ${this._coverSize}인치를 사용합니다.`;
    }
    return `[${this.model}] 메인 화면 ${this._mainSize}인치를 사용합니다.`;
  }

  putInPocket() {
    const msgs = [];
    if (!this._isFolded) {
      this._isFolded = true;
      msgs.push(`[${this.model}] 화면을 접었습니다.`);
    }
    msgs.push(
      `[${this.model}] 접은 상태(${this._coverSize}인치)로 주머니에 넣습니다.`
    );
    return msgs.join("\n");
  }

  charge(amount) {
    const half = amount / 2;
    this.battery = this.battery + amount;
    return `[${this.model}] 듀얼 배터리 충전 (상단 +${half}%, 하단 +${half}%). 현재 배터리: ${this.battery}%`;
  }

  get typeName() {
    return "FoldablePhone";
  }
}

// 단계 4: 인스턴스 생성 팩토리
export function createPhones() {
  return [
    new BarPhone("Galaxy S25", 6.2, 85, 162, 90),
    new BarPhone("iPhone 16", 6.1, 70, 170, 88),
    new FoldablePhone("Galaxy Z Fold 6", 6.3, 7.6, 60, 239, 70),
    new FoldablePhone("Galaxy Z Flip 6", 3.4, 6.7, 75, 187, 72),
  ];
}

// 직렬화 가능한 상태 반환 (React state 용)
export function getPhoneState(phone) {
  const base = {
    model: phone.model,
    screenSize: phone.screenSize,
    battery: phone.battery,
    weight: phone.weight,
    durability: phone.durability,
    typeName: phone.typeName,
  };
  if (phone instanceof FoldablePhone) {
    base.isFolded = phone.isFolded;
    base.mainSize = phone.mainSize;
    base.coverSize = phone.coverSize;
    base.isFoldable = true;
  } else {
    base.isFoldable = false;
  }
  return base;
}

export { SmartphoneADT, Smartphone, BarPhone, FoldablePhone };
