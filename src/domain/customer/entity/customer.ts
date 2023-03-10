import Address from "./address";
import CustomerInterface from './customer-interface'

export default class Customer implements CustomerInterface{
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string, active: boolean=false) {
        this._id =id;
        this._name = name;
        this._active = active;
        this.validate();
    }

    get id(): string {
        return this._id;
    }
    
    get name(): string {
        return this._name;
     }

     get rewardPoints(): number {
        return this._rewardPoints;
     }

     get Address(): Address {
        return this._address;
     }

     isActive(): boolean {
        return this._active;
      }

    changeName(name : string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address : Address) {
        this._address = address;
    }

    activate() {
        if(this._address === undefined) {
            throw new Error(`Address is mandatory for activate a costumer`) 
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }
    addRewardPoints(rewardPoints : number) {
        this._rewardPoints += rewardPoints;

    }
    validate () {
        if (this._id.length === 0) {
            throw new Error(`Id is required`)
        }
        if (this._name.length === 0) {
            throw new Error(`Name is required`)
        }
    }
    set Address(address: Address) {
        this._address = address;
      }
}