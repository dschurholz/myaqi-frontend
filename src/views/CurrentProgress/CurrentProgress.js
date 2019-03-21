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
            title: 'Introduction Title',
            pages: 6,
            progress: 95,
            isOpen: false,
            subchapters: [
              {
                title: "Introduction",
                progress: 95,
                depth: 0
              }, {
                title: "Research Motivation",
                progress: 95,
                depth: 0
              }, {
                title: "Contribution",
                progress: 95,
                depth: 0
              }, {
                title: "Research Methodology",
                progress: 95,
                depth: 0
              }, {
                title: "Sustainability Analysis",
                progress: 95,
                depth: 0
              }, {
                title: "Thesis Structure",
                progress: 95,
                depth: 0
              }
            ]
          }, {
            title: 'Background & Literature Review',
            pages: 17,
            progress: 95,
            isOpen: false,
            subchapters: [
              {
                title: "Context Awareness",
                progress: 95,
                depth: 0
              }, {
                title: "Definitions",
                progress: 95,
                depth: 1
              }, {
                title: "Context Space Theory",
                progress: 95,
                depth: 2
              }, {
                title: "Context Prediction",
                progress: 95,
                depth: 3
              }, {
                title: "Context Aware System Architecture",
                progress: 95,
                depth: 4
              }, {
                title: "General Prediction Methods",
                progress: 95,
                depth: 0
              }, {
                title: "Outdoor Air Quality Monitoring",
                progress: 95,
                depth: 0
              }, {
                title: "Outdoor Air Quality Prediction",
                progress: 80,
                depth: 1
              }, {
                title: "Context Aware Outdoor Air Quality Monitoring and Prediction",
                progress: 95,
                depth: 2
              }
            ]
          }, {
            title: 'Context Model',
            pages: 2,
            progress: 40,
            isOpen: false,
            subchapters: [
              {
                title: "Introduction",
                progress: 50,
                depth: 0
              }, {
                title: "Context Model",
                progress: 80,
                depth: 0
              }, {
                title: "Air Quality Context Model",
                progress: 50,
                depth: 1
              }, {
                title: "User Context Model",
                progress: 10,
                depth: 2
              }, {
                title: "Extended Context Attributes",
                progress: 50,
                depth: 3
              }, {
                title: "ECSTRA Situation Reasoning",
                progress: 0,
                depth: 0
              }, {
                title: "Summary",
                progress: 0,
                depth: 0
              }
            ]
          }, {
            title: 'System Design & Architecture',
            pages: 2,
            progress: 40,
            isOpen: false,
            subchapters: [
              {
                title: "Overall System Architecture",
                progress: 90,
                depth: 0
              }, {
                title: "Data Storage Level",
                progress: 10,
                depth: 0
              }, {
                title: "Prediction Algorithm",
                progress: 10,
                depth: 0
              }, {
                title: "Context Feeding Layer",
                progress: 0,
                depth: 0
              }, {
                title: "Situation Reasoning Layer",
                progress: 0,
                depth: 0
              }, {
                title: "Visualization Layer",
                progress: 0,
                depth: 0
              }, {
                title: "Summary",
                progress: 0,
                depth: 0
              }
            ]
          }, {
            title: 'Implementation and Experiment Setup',
            pages: 1.5,
            progress: 20,
            isOpen: false,
            subchapters: [
              {
                title: "Implementation",
                progress: 50,
                depth: 0
              }, {
                title: "System Setup",
                progress: 10,
                depth: 1
              }, {
                title: "Equipment and Devices",
                progress: 0,
                depth: 2
              }, {
                title: "Software",
                progress: 50,
                depth: 3
              }, {
                title: "Networking",
                progress: 0,
                depth: 4
              }, {
                title: "End-user interface",
                progress: 40,
                depth: 5
              }, {
                title: "Development",
                progress: 0,
                depth: 6
              }, {
                title: "Experiments",
                progress: 20,
                depth: 0
              }, {
                title: "Datasets Descriptions",
                progress: 40,
                depth: 1
              }, {
                title: "Experiment Setup",
                progress: 10,
                depth: 2
              }
            ]
          }, {
            title: 'Results',
            pages: 0,
            progress: 0,
            isOpen: false,
            subchapters: []
          }, {
            title: 'Conclusions',
            pages: 0.5,
            progress: 10,
            isOpen: false,
            subchapters: []
          }, {
            title: 'Future Work',
            pages: 0,
            progress: 0,
            isOpen: false,
            subchapters: []
          }
        ],
        references: 46
      },
      extraProgress: [
        {
          task: "Finished General Context Prediction Section in literature review",
          color: "secondary"
        },
        {
          task: "Added 3 Deep Learning AQ Prediction Approaches to Taxonomy and Literature Review",
          color: "secondary"
        },
        {
          task: "Added Traffic from Google Maps to simulator",
          color: "secondary"
        },
        {
          task: "Started adding Bing Maps incidents to simulator, will use this as traffic events.",
          color: "success"
        },
        {
          task: "Started working on context and situation prediction algorithm with TensorFlow and Keras libraries",
          color: "success"
        }
      ],
      futureTasks: [
        {
          task: "Finish dataset preparing for prediction algorithm input",
          color: "warning"
        },
        {
          task: "Continue on prediction algorithm development",
          color: "warning"
        },
        {
          task: "Start outline and draft of paper",
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
                                        <ListGroupItem key={index} className="justify-content-between">{(subchapter.depth > 0 ? '\t': '') + (idx+1) + '.' + (index+1-subchapter.depth) + (subchapter.depth === 0 ? '. ': '.' + subchapter.depth + '. ') + subchapter.title}<span className="float-right"><b>Progress:</b> {subchapter.progress}%</span></ListGroupItem>
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
