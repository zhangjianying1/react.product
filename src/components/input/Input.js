import React from 'react';



class Input extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            input: {
                name: this.props.name,
                val: this.props.val
            },
            msg: this.props.msg
        }
    }
    inputChange(e){
        let val = e.target.value;
        this.changeHandle(val);
    }
    clearVal(){
        this.changeHandle('')
    }
    changeHandle(val){
        let msg = '',
            props = this.props;

        if (props.maxlength) {
            val = val.substring(0, props.maxlength)
        }
        if (props.minlength) {

            if (val.length < props.minlength ) {
                msg = '您输入的' + this.state.msg + '不正确';
            }
        }
        if (props.pattern) {
            let pattern = new RegExp(props.pattern, 'g');

            if (!pattern.test(val)) {

                msg = '您输入的' + this.state.msg + '不正确';
            }
        }
        this.setState({
            input: {
                name: props.name,
                val: val
            }
        });

        props.setValue(props.name, val, msg);
    }



    componentWillReceiveProps(nextProps){

        if (nextProps) {
            this.setState({
                input: {
                    val: nextProps.val,
                    name: nextProps.name
                }
            })
        }
    }
    render(){


            if (this.props.tagName == 'textarea') {
                return (
                    <div>
                        <textarea className={this.props.className} onChange={(e) => this.inputChange(e)} type={this.props.type}
                                  name={this.state.input.name}

                                  value={this.state.input.val} placeholder={this.props.placeholder} autoComplete="off"
                                  required></textarea>
                    </div>
                )
            } else {
                return (
                    <div>
                        <input onChange={(e) => this.inputChange(e)} type={this.props.type} name={this.state.input.name}
                               disabled={this.props.disabled}
                               value={this.state.input.val} placeholder={this.props.placeholder} autoComplete="off"
                               required/>
                        <span className="input-control clear-btn" onClick={() => this.clearVal()}></span>
                    </div>
                )
            }


    }
}
Input.propTypes = {
    setValue: React.PropTypes.func.isRequired,
    name: React.PropTypes.string,
    type: React.PropTypes.string
}
export default Input;