// import React, {Component} from 'react';
// import AutoComplete from 'react-autocomplete';
// import {fakeRequest } from '../utils/searchCountry'


// export default class Search extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       stateValue: '',
//       cityValue: '',
//       unitedStates: [],
//       loading: false
//     }
//     this.requestTimer = null;
//     // this.renderItems = this.renderItems.bind(this);
//   }

//   renderItems(items) {
//     console.log('im the items', items)
//     return items.map((item, index) => {
//       const text = item.props.children
//       if (index === 0 || items[index - 1].props.children.charAt(0) !== text.charAt(0)) {
//         return [<div className="item item-header">{text.charAt(0)}</div>, item]
//       }
//       else {
//         return item
//       }
//     })
//   }

//   render() {
//     // debugger;
//     return (
//       <div>
//         <AutoComplete
//           value = {this.state.stateValue}
//           wrapperStyle={{ position: 'relative', display: 'inline-block' }}
//           items={this.state.unitedStates}
//           getItemValue={(item) => item.name}
//           onSelect={(value, state) => this.setState({ value, unitedStates: [state] })}
//           onChange={(event, value) => {
//             this.setState({ stateValue, loading: true, unitedStates: [] })
//             clearTimeout(this.requestTimer)
//             this.requestTimer = fakeRequest(value, (items) => {
//               this.setState({ unitedStates: items, loading: false })
//             })
//           }}

//           renderItem={(item, isHighlighted) => (
//             <div
//               className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
//               key={item.abbr}
//             >{item.name}</div>
//           )}

//           renderMenu={(items, value) => (
//             <div className="menu">
//               {value === '' ? (
//                 <div className="item">Choose a State</div>
//               ) : this.state.loading ? (
//                 <div className="item">Loading...</div>
//               ) : items.length === 0 ? (
//                 <div className="item">No matches for {value}</div>
//               ) : this.renderItems(items)}
//             </div>
//           )}
//         />
//         <AutoComplete

//         />
//       </div>
//     )
//   }
// }


import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import suggestions from '../utils/searchCountry.json';


function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps;
  // console.log('im the inputProps', inputProps);

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(`${suggestion.name}, ${suggestion.subcountry}, ${suggestion.country}`, query);
  const parts = parse(`${suggestion.name}, ${suggestion.subcountry}, ${suggestion.country}`, matches);
  // console.log('this is the query', query);
  // console.log('this is the matches', matches);
  // console.log('this.is the parts', parts)
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
              <strong key={index} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return `${suggestion.name}, ${suggestion.subcountry}, ${suggestion.country}`;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && `${suggestion.name}, ${suggestion.subcountry}, ${suggestion.country}`.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 80,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit * .1,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    overflowY: 'auto',
    zIndex: 100,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 20,
    width: 250,
  },
});

class Search extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    console.log('im the event', event);
    console.log('im the new value', newValue);
    console.log('im the props', this.props);
    this.props.Destination(newValue);
    // this.setState({
    //   value: newValue,
    // });
  };

  render() {
    const { classes } = this.props;
    console.log('this is props', this.props)
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder: 'Search a destination',
          value: this.props.destination,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
