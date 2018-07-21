import React, {Component} from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import circle from '@fortawesome/fontawesome-free-regular/faCircle';
import checkCircle from '@fortawesome/fontawesome-free-regular/faCheckCircle';
import { Checkbox } from '@material-ui/core';

class CheckBoxRenderer extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSelected: props.node.isSelected()
        };
    }

    refresh = ({node}) => {
        if (this.state.isSelected !== node.isSelected()) {
            this.setState({isSelected: node.isSelected()})
        }
        return true;
    };

    render(){
        const {api, node} = this.props;
        const mutableNode = api.getRowNode(node.id);
        return (
            <Checkbox checked={mutableNode.isSelected()}
                      icon={<FontAwesomeIcon icon={circle} color='red'/>}
                      checkedIcon={<FontAwesomeIcon icon={checkCircle} color='#25bf75'/>}
                      inputProps={{
                          onClick: () => mutableNode.setSelected(!mutableNode.selected)
                      }}
            />
        );
    }
}

export default CheckBoxRenderer;