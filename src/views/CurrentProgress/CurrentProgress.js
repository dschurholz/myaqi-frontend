import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Collapse,
  Button
} from 'reactstrap';


class CurrentProgress extends Component {

  constructor (props) {
    super(props);
    this.state = {
      thesisDocument: {
        overallProgress: 0,
        overallPages: 0,
        chapters: [
          {
            title: 'Introduction',
            pages: 7,
            progress: 99,
            isOpen: false,
            subchapters: [
              {
                title: "Introduction",
                progress: 100,
                subchapterNum: 1
              }, {
                title: "Research Motivation",
                progress: 100,
                subchapterNum: 2
              }, {
                title: "Contribution",
                progress: 100,
                subchapterNum: 3
              }, {
                title: "Research Methodology",
                progress: 100,
                subchapterNum: 4
              }, {
                title: "Sustainability Analysis",
                progress: 100,
                subchapterNum: 5
              }, {
                title: "Thesis Structure",
                progress: 100,
                subchapterNum: 6
              }
            ]
          }, {
            title: 'Background & Literature Review',
            pages: 30,
            progress: 98,
            isOpen: false,
            subchapters: [
              {
                title: "Context Awareness",
                progress: 100,
                subchapterNum: 1
              }, {
                title: "Definitions",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 1
              }, {
                title: "Context Space Theory",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 2
              }, {
                title: "Context Prediction",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 3
              }, {
                title: "Context Aware System Architecture",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 4
              }, {
                title: "Context Prediction Methods",
                progress: 100,
                subchapterNum: 2
              }, {
                title: "Continous Time-Series Prediction",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 1
              }, {
                title: "Categorical Time-Series Prediction",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 2
              }, {
                title: "Outdoor Air Quality Monitoring",
                progress: 100,
                subchapterNum: 3
              }, {
                title: "Outdoor Air Quality Prediction",
                progress: 95,
                subchapterNum: 3,
                subsubchapterNum: 1
              }, {
                title: "Context Aware Outdoor Air Quality Monitoring and Prediction",
                progress: 95,
                subchapterNum: 3,
                subsubchapterNum: 2
              }
            ]
          }, {
            title: 'Context Modelling',
            pages: 10,
            progress: 100,
            isOpen: false,
            subchapters: [
              {
                title: "Introduction",
                progress: 100,
                subchapterNum: 1
              }, {
                title: "Context Modelling",
                progress: 100,
                subchapterNum: 2
              }, {
                title: "Air Quality Attributes",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 1
              }, {
                title: "Extended External Attributes",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 2
              }, {
                title: "User Attributes",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 3
              }, {
                title: "Situation Reasoning",
                progress: 90,
                subchapterNum: 3
              }, {
                title: "Prediction Model",
                progress: 10,
                subchapterNum: 4
              }, {
                title: "Summary",
                progress: 90,
                subchapterNum: 5
              }
            ]
          }, {
            title: 'System Architecture & Implementation',
            pages: 7,
            progress: 97,
            isOpen: false,
            subchapters: [
              {
                title: "Architecture",
                progress: 100,
                subchapterNum: 1
              }, {
                title: "Backend Layer",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 1
              }, {
                title: "Frontend Layer",
                progress: 100,
                subchapterNum: 1,
                subsubchapterNum: 2
              }, {
                title: "Implementation",
                progress: 95,
                subchapterNum: 2
              }, {
                title: "Equipment and Devices",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 1
              }, {
                title: "Software",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 2
              }, {
                title: "Communications",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 3
              }, {
                title: "End-user interface",
                progress: 100,
                subchapterNum: 2,
                subsubchapterNum: 4
              }, {
                title: "Development",
                progress: 90,
                subchapterNum: 2,
                subsubchapterNum: 5
              }, {
                title: "Summary",
                progress: 100,
                subchapterNum: 3
              }
            ]
          }, {
            title: 'Experiments and Results',
            pages: 1,
            progress: 10,
            isOpen: false,
            subchapters: [
              {
                title: "Experiments",
                progress: 20,
                subchapterNum: 1
              }, {
                title: "Datasets Descriptions",
                progress: 40,
                subchapterNum: 1,
                subsubchapterNum: 1
              }, {
                title: "Experiment Setup",
                progress: 0,
                subchapterNum: 1,
                subsubchapterNum: 2
              }, {
                title: "Results",
                progress: 0,
                subchapterNum: 2
              }
            ]
          }, {
            title: 'Conclusions & Future Work',
            pages: 1,
            progress: 10,
            isOpen: false,
            subchapters: []
          }
        ],
        references: 65
      },
      extraProgress: [
        {
          task: "Finish outdoor air quality monitoring techniques table in literature review",
          color: "secondary"
        },
        {
          task: "Add system architecture to thesis",
          color: "secondary"
        },
        {
          task: "Add system implementation to thesis",
          color: "secondary"
        },
        {
          task: "Work on context and situation prediction algorithm with TensorFlow and Keras libraries",
          color: "success"
        },
        {
          task: "Get prediction results and compare to other methods.",
          color: "success"
        }
      ],
      futureTasks: [
        {
          task: "Finish experiments and results chapter on thesis document.",
          color: "warning"
        },
        {
          task: "Add prediction algorithm subsection to thesis",
          color: "warning"
        },
        {
          task: "Fill paper for RuSMART publication",
          color: "secondary"
        },
        {
          task: "Fill paper for IoT Conference publication",
          color: "secondary"
        },
        {
          task: "Write abstract",
          color: "secondary"
        }
      ]
    };
    var c;
    for (c in this.state.thesisDocument.chapters) {
      let chapter = this.state.thesisDocument.chapters[c];
      this.state.thesisDocument.overallPages += chapter.pages;
      this.state.thesisDocument.overallProgress += chapter.progress;
    }
    this.state.thesisDocument.overallProgress = Math.round(this.state.thesisDocument.overallProgress/c, 2);
  }

  toggleChapter(chapter) {
    var upState = this.state.thesisDocument;
    upState.chapters.forEach((c, index) => {
      c.isOpen = c.title === chapter ? !c.isOpen : false;
    });

    this.setState({
      thesisDocument: upState,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


  render() {

    var { thesisDocument, extraProgress, futureTasks } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-list"></i> Thesis Document
              </CardHeader>
              <CardBody className="pb-0">
                  <div className="accordion" id="accordion">
                    {
                      thesisDocument.chapters.map((chapter, idx) => {
                        return (
                          <Card key={idx} style={{marginBottom: '0px'}}>
                            <CardHeader id={"heading" + idx}>
                              <span className="text-right float-right"><div><b># Pages:</b> {chapter.pages}</div><div><b>Progress:</b> {chapter.progress}%</div></span>
                              <Button color="link" className="text-left m-0 p-0" onClick={() => this.toggleChapter(chapter.title)} aria-expanded={chapter.isOpen} aria-controls={"collapse" + idx} disabled={chapter.subchapters.length === 0}>
                                <h5 className="m-0 p-0">{(idx+1) + '. ' + chapter.title}</h5>
                              </Button>
                            </CardHeader> 
                            <Collapse isOpen={chapter.isOpen} data-parent="#accordion" id={"collapse" + idx} aria-labelledby={"heading" + idx}>
                              <CardBody>
                                <ListGroup>
                                  {
                                    chapter.subchapters.map((subchapter, index) => {
                                      return (
                                        <ListGroupItem key={index} className="justify-content-between">{(!subchapter.subsubchapterNum ? '' : <>&nbsp;&nbsp;</>)}{subchapter.subchapterNum + (!subchapter.subsubchapterNum ? '': '.' + subchapter.subsubchapterNum)  + '. ' + subchapter.title}<span className="float-right"><b>Progress:</b> {subchapter.progress}%</span></ListGroupItem>
                                      )
                                    })
                                  }
                                </ListGroup>
                              </CardBody>
                            </Collapse>
                          </Card>
                        );
                      })
                    }
                    <Card style={{marginBottom: '0px'}}>
                      <CardHeader>
                        <span className="float-right">{thesisDocument.references}</span>
                        <h5 className="mb-0">
                          References
                        </h5>
                      </CardHeader>
                    </Card>
                    <Card style={{marginBottom: '0px'}}>
                      <CardHeader>
                        <span className="text-right float-right"><div><b># Pages:</b> {thesisDocument.overallPages}</div><div><b>Progress:</b> {thesisDocument.overallProgress}%</div></span>
                        <h5 className="mb-0">
                          Overall progress
                        </h5>                      
                      </CardHeader>
                    </Card>
                  </div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="12" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-list"></i> Tasks done
              </CardHeader>
              <CardBody className="pb-0">
                  <ListGroup className="list-group-flush">
                    {
                      extraProgress.map((bullet, idx) => {
                        return (
                          <ListGroupItem key={idx} className="justify-content-between" color={bullet.color}>{bullet.task}</ListGroupItem>
                        );
                      })
                    }
                  </ListGroup>
              </CardBody>
            </Card>
            <Card className="text-black map-card">
                <CardHeader>
                  <i className="fa fa-list"></i> Future Tasks
                </CardHeader>
                <CardBody className="pb-0">
                    <ListGroup className="list-group-flush">
                      {
                        futureTasks.map((bullet, idx) => {
                          return (
                            <ListGroupItem key={idx} className="justify-content-between" color={bullet.color}>{bullet.task}</ListGroupItem>
                          );
                        })
                      }
                    </ListGroup>
                </CardBody>
              </Card>
            </Col>
        </Row>
      </div>
    );
  }
}

export default CurrentProgress;
