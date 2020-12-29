const app = Vue.createApp({
    data(){
        return{
            currentOperand:{
                mag:"0",
                hasDecimal:false,
                isPositive:true
            },
            pastOperands:[],
            numbers:["7","8","9","4","5","6","1","2","3","+/-","0","."],
            operators:[
                {id:"add",label:"+",action: this.add},
                {id:"subtract",label:"-",action: this.subtract},
                {id:"multiply",label:"*",action: this.multiply},
                {id:"divide",label:"/",action: this.divide},
                {id:"percent",label: "%", action: this.percent},
                {id:"sqrt",label:'\u221Ax',action: this.sqrt},
                {id:"square",label:'x^2',action: this.square},
                {id:"reciprocal",label:'1/x',action: this.reciprocal},
                {id:"delete",label:'\u232B',action: this.delete},
                {id:"cancel",label:"C", action: this.resetCalc},
                {id:"equals",label:"=", action: this.evaluate}
            ],
            actions:[],
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
                if(this.currentOperand.mag === "0"){
                    this.currentOperand.mag = input;
                }else{
                    this.currentOperand.mag+=input;
                }
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
            if(this.currentOperand.mag.length == 0){
                this.currentOperand.mag = "0";
            }
        },
        add(){
            this.actions.push(createAction("+","add?",false));
            this.pastOperands.push(this.crntOperand);
            this.resetCurrentOperand();
        },
        subtract(){
            this.actions.push(createAction("-","subtract?",false));
            this.pastOperands.push(this.crntOperand);
            this.resetCurrentOperand();
        },
        multiply(){
            this.actions.push(createAction("*","multiply?",false));
            this.pastOperands.push(this.crntOperand);
            this.resetCurrentOperand();
        },
        divide(){
            this.actions.push(createAction("/","divide?",false));
            this.pastOperands.push(this.crntOperand);
            this.resetCurrentOperand();
        },
        percent(){
            this.pastOperands.push(this.crntOperand);
            this.actions.push(createAction("%","percent?",false));
            this.currentOperand = parseResponse(this.pastOperands[this.pastOperands.length-2]);
            this.evaluate();
        },
        reciprocal(){
            this.pastOperands.push("1");
            this.actions.push(createAction("/","divide?",false));
            this.evaluate();
        },
        square(){
            this.actions.push(createAction("^2","square?",true));
            this.evaluate();
        },
        sqrt(){
            this.actions.push(createAction("sqrt","sqrt?",true));
            this.evaluate();
        },
        /**evaluates the currentAction.
         * If current action is unary, 
         * the current operand is used and replaced by the result
         * If the current action is binary,
         * the request is sent with the past operand as x and current operand as y
         * Then the past operand is set to the current operand
         * and the current operand is set to the response
         */
        evaluate(){
            if(this.actions.length > 0)
            {
                let action = this.actions.pop();
                let request = "http://localhost:8080/"+action.name;
                if(action.isUnary){
                    request +=new URLSearchParams({x:this.crntOperand}).toString();
                    
                    fetch(request)
                    .then(
                        response => {
                            this.error = !response.ok;
                            return response.json();})
                            .then(
                                data =>{
                                    this.currentOperand = parseResponse(data);
                                }
                                )
                }else{
                    let pOp = this.pastOperands.pop();

                    request += new URLSearchParams({
                        x:pOp,
                        y:this.crntOperand
                    }).toString();

                    fetch(request)
                    .then(
                        response => {
                            this.error = !response.ok;
                            return response.json();})
                            .then(
                                data => {
                                    //this.pastOperand = this.crntOperand;
                                    this.currentOperand = parseResponse(data);
                                }
                                )
            }
                
                
            }
        },
        resetCurrentOperand(){
            this.currentOperand = parseResponse(0);
        },
        resetCalc(){
            this.resetCurrentOperand();
            this.actions = [];
            this.error = false;
            this.pastOperands = [];
        }
    },
    computed:{
        crntOperand(){
            if(!this.error)
                return (this.currentOperand.isPositive?'':'-')+this.currentOperand.mag;
            else return "E";
        },
        pastCalcs(){
            let ans = "";
            for(i = 0; i < this.pastOperands.length; i++){//only want to output as many actions as there are operands
                ans += this.pastOperands[i] + this.actions[i].label;
            }
            return ans;
        }
    }
})


function parseResponse(data){
    let ans ={mag:"",isPositive:false,hasDecimal:false};
    ans.mag = String(Math.abs(data));
    ans.isPositive = data >= 0;
    ans.hasDecimal = Math.floor(data) != Math.ceil(data);
    return ans;
}

function createAction(label = "", name = "",isUnary = false){
    return {label: label, name:name, isUnary:isUnary};
}