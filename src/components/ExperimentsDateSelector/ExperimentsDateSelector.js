// ExperimentsDateSelector.js

import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Col,
  FormGroup,
  FormText,
  Input,
  Row
} from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import { utils } from "../../utils";
import { experimentsDateSelected } from '../../actions';

import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);
const SLIDER_MARKS = ['2017-07-01T00', '2018-01-01T00', '2018-07-01T00'];
const SLIDER_MARKS_STYLE = { fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap'};
const SLIDER_HANDLE_STYLE = [{borderColor: '#0288D1'}];
const SLIDER_ACTIVE_HANDLE_STYLE = [{borderColor: '#0288D1', boxShadow: '0 0 0 2px #0288D1'}];
const SLIDER_TRACK_STYLE = [{backgroundColor: '#0288D1'}];

class ExperimentsDateSelector extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  interval = null;

  constructor(props) {
    super(props);

    this.state = {
      dateIdx: this.props.value,
      playing: false,
      speed: 0.5,
      specificDate: '2017-01-01'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.selectedDate) {
      this.onAfterChange(0);
    }
  }

  onAfterChange = (idx) => {
    const { onDateChanged, dateRange } = this.props;

    if (onDateChanged && dateRange.length > 0) onDateChanged(dateRange[idx]);
  }

  onSliderChange = (dateIdx) => {
    const {dateRange} = this.props,
          specificDate = dateRange[dateIdx].substr(0, 10);
    this.setState({
      dateIdx,
      specificDate
    });
  }

  togglePlay = () => {
    const { playing, speed } = this.state;
    this.setState({
      playing: !playing
    });

    if (!playing && !this.interval) {
      const that = this;
      this.interval = setInterval(function(){
        if (that.nextStep()) {
          clearInterval(that.interval);
        }
      }, 1000 * speed);
    } else {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  prevStep = () => {
    const { dateIdx } = this.state,
          newIdx = dateIdx > 0 ? dateIdx - 1 : 0;

    if (dateIdx !== newIdx) {
      this.onSliderChange(newIdx);
      this.onAfterChange(newIdx)
    }
  }

  nextStep = () => {
    const { dateIdx } = this.state,
          { dateRange } = this.props,
          newIdx = dateIdx < dateRange.length-1 ? dateIdx + 1 : dateIdx;

    if (dateIdx !== newIdx) {
      this.onSliderChange(newIdx);
      this.onAfterChange(newIdx)
    }

    return dateIdx === dateRange.length-1;
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleDateChange(event) {
    const { value } = event.target,
          { dateRange } = this.props,
          newIdx = dateRange.indexOf(value + 'T00:00:00');
    
    if (value) {
      this.onSliderChange(newIdx);
      this.onAfterChange(newIdx);
    }
  }

  render () {
    const { dateRange, isFetchingData } = this.props;

    if(dateRange.length === 0 && !isFetchingData) {
      return (
      <div className="pl-4">
        No dates available.
      </div>
      );
    }
    if(dateRange.length === 0 && isFetchingData) {
      return (
      <div>
         {utils.loaders.TableLoader({style: { height: '50px' }})}
      </div>
      );
    }

    let marks = {0: { label: dateRange[0].split('T')[0], style: SLIDER_MARKS_STYLE }};
    marks[dateRange.length-1] = { label: dateRange[dateRange.length-1].split('T')[0], style: SLIDER_MARKS_STYLE };
    dateRange.forEach((date, idx) => {
      let d = date.split(':')[0];
      if (SLIDER_MARKS.includes(d)) {
        marks[idx] = { label: d.split('T')[0], style: SLIDER_MARKS_STYLE };
      }
    });
    return (
      <Suspense fallback={this.loading()}>
      <Row style={{minHeight: '80px', padding: '20px 50px'}} className="p-20">
        <Col xs="12" sm="12" lg="12">
        <SliderWithTooltip
          max={dateRange.length-1}
          marks={marks}
          onChange={this.onSliderChange}
          onAfterChange={this.onAfterChange}
          dotStyle={SLIDER_HANDLE_STYLE[0]}
          activeDotStyle={SLIDER_ACTIVE_HANDLE_STYLE[0]}
          trackStyle={SLIDER_TRACK_STYLE}
          handleStyle={SLIDER_HANDLE_STYLE}
          defaultValue={0}
          value={this.state.dateIdx}
          tipFormatter={value => !!value ? `${dateRange[value].substr(0, 10)} ${dateRange[value].substr(11, 2)}h` : 'NaN'}
          disabled={this.state.playing} />
        </Col>
      </Row>
      <hr/>
      <FormGroup row className="pl-4 pr-4">
        <Col sm="6" md="4">
          <Input type="number" min="0.05" step="0.05" max="10.0" id="speed" name="speed" placeholder="Speed (in secs)" disabled={this.state.playing} value={this.state.speed} onChange={this.handleInputChange}/>
          <FormText color="muted">Play the experiments at this speed.</FormText>
        </Col>
        <Col sm="6" md="4" className="text-center">
          <ButtonGroup>
            <Button type="button" size="md" color="primary" onClick={this.prevStep.bind(this)} disabled={this.state.playing}><i className="fa fa-backward"></i> Prev h</Button>
            {
              (!this.state.playing) ?
                <Button type="button" size="md" color="primary" onClick={this.togglePlay.bind(this)}><i className="fa fa-play"></i> Play</Button>
              :
                <Button type="button" size="md" color="primary" onClick={this.togglePlay.bind(this)}><i className="fa fa-pause"></i> Pause</Button>
            }
            <Button type="button" size="md" color="primary" onClick={this.nextStep.bind(this)} disabled={this.state.playing}><i className="fa fa-forward"></i> Next h</Button>
          </ButtonGroup>
        </Col>
        <Col sm="6" md="4">
          <Input type="date" id="specificDate" name="specificDate" disabled={this.state.playing} value={this.state.specificDate} min="2017-01-01" max="2018-12-31" onChange={this.handleDateChange}/>
          <FormText color="muted">Go to a specific date.</FormText>
        </Col>
      </FormGroup>
      </Suspense>
    );
  }
};

function getDateRange(timeline) {
  return Object.keys(timeline);
}

const mapStateToProps = state => {
  const { experimentsData, isFetchingExperimentsMapData } = state.experimentsMapData,
    { selectedExperimentsDate } = state;

  return {
  selectedDate: selectedExperimentsDate,
  dateRange: experimentsData.timeline ? getDateRange(experimentsData.timeline) : [],
  isFetchingData: isFetchingExperimentsMapData
  };
};

const mapDispatchToProps = dispatch => {
  return {
  onDateChanged: selectedDate => {
    dispatch(experimentsDateSelected(selectedDate));
  },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentsDateSelector);
