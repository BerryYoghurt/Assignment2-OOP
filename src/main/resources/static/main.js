const app = Vue.createApp({
    data(){
        return{
            currentOperand:{
                mag:"0",
                hasDecimal:false,
                isPositive:true
            },
            pastOperand:"0",
            numbers:["7","8","9","4","5","6","1","2","3","+/-","0","."],
            operators:[
                {id:"+",action: this.add},
                {id:"-",action: this.subtract},
                {id:"*",action: this.multiply},
                {id:"/",action: this.divide},
                {id:'\u221Ax',action: this.sqrt},
                {id:'x^2',action: this.square},
                {id:'1/x',action: this.reciprocal},
                {id:'\u232B',action: this.delete},
                {id:"=", action: this.evaluate},
                {id:"C", action: this.resetCalc}
            ],
            currentAction:{
                name:null,
                isUnary:false
            },
            error:false
        }
    },
    methods:{
        updateOperand(input){
            if(input == "."){
                if(!this.currentOperand.hasDecimal){
                    this.currentOperand.mag+=input;//consider case where user sends with decimal at the end
                    this.currentOperand.hasDecimal=true;
                }
            }
            else if(input != "+/-"){
                this.currentOperand.mag+=input;
            }else{
                this.currentOperand.isPositive = !this.currentOperand.isPositive;
            }
        },
        delete(){
            if(+this.currentOperand.mag != 0 || +this.currentOperand.mag.length > 1){
                let deleted = this.currentOperand.mag[this.currentOperand.mag.length-1];
                this.currentOperand.mag = this.currentOperand.mag.slice(0,this.currentOperand.mag.length-1);
                if(deleted == "."){
                    this.currentOperand.hasDecimal = false;
                }
            }
        },
        add(){
            if(this.currentAction.name){
                this.evaluate();
            }
            this.currentAction.name = "add?";
            this.currentAction.isUnary = false;
            this.pastOperand = this.crntOperand;
            this.resetCurrentOperand();
        },
        subtract(){
            if(this.currentAction.name){
                this.evaluate();
            }
            this.currentAction.name = "subtract?";
            this.currentAction.isUnary = false;
            this.pastOperand = this.crntOperand;
            this.resetCurrentOperand();
        },
        multiply(){
            if(this.currentAction.name){
                this.evaluate();
            }
            this.currentAction.name = "multiply?";
            this.currentAction.isUnary = false;
            this.pastOperand = this.crntOperand;
            this.resetCurrentOperand();
        },
        divide(){
            if(this.currentAction.name){
                this.evaluate();
            }
            this.currentAction.name = "divide?";
            this.isUnaryAction = false;
            this.pastOperand = this.crntOperand;
            this.resetCurrentOperand();
        },
        reciprocal(){
            let tempAction = this.currentAction;
            this.currentAction.name = "divide?";
            this.currentAction.isUnary = false;
            let tempPast = this.pastOperand;
            this.pastOperand = "1";
            this.evaluate();
            this.currentAction = tempAction;
            this.pastOperand = tempPast;
        },
        square(){
            let tempAction = this.currentAction;
            this.currentAction.name = "square?";
            this.currentAction.isUnary = true;
            this.evaluate();
            this.currentAction = tempAction;
        },
        sqrt(){
            let tempAction = this.currentAction;
            this.currentAction.name = "sqrt?";
            this.currentAction.isUnary = true;
            this.evaluate();
            this.currentAction = tempAction;
        },
        evaluate(){
            if(this.currentAction.name)
            {
                if(this.currentAction.isUnary){
                    fetch("http://localhost:8080/"+this.currentAction.name + new URLSearchParams({
                        x:this.crntOperand
                    }).toString())
                        .then(
                        response => {
                            this.error = !response.ok;
                            return response.json();})
                            .then(
                                data =>{
                                    this.parseResponse(data);
                                }
                            )
                    
                }else{
                    fetch("http://localhost:8080/"+this.currentAction.name + new URLSearchParams({
                        x:this.pastOperand,
                        y:this.crntOperand
                    }).toString())
                        .then(
                        response => {
                            this.error = !response.ok;
                            return response.json();})
                            .then(
                                data => {
                                    this.pastOperand = this.crntOperand;
                                    this.parseResponse(data);
                                }
                            )
                }
                this.currentAction.name = null;
            }

        },
        resetCurrentOperand(){
            this.currentOperand.mag = "0";
            this.currentOperand.isPositive = true;
            this.currentOperand.hasDecimal = false;
        },
        parseResponse(data){
            this.currentOperand.mag = String(Math.abs(data));
            this.currentOperand.isPositive = data >= 0;
            this.currentOperand.hasDecimal = Math.floor(data) != Math.ceil(data);
        },
        resetCalc(){
            this.resetCurrentOperand();
            this.currentAction.name = null;
            this.error = false;
        }
    },
    computed:{
        crntOperand(){
            if(!this.error)
                return (this.currentOperand.isPositive?'':'-')+this.currentOperand.mag;
            else return "E";
        }
    }
})