def generate_bpmn_xml(requirements, process_id="Process_1", process_name="SAP Process"):
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="{process_id}" name="{process_name}" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start Process"/>
"""

    for i, req in enumerate(requirements):
        xml += f"""    <bpmn:task id="Task_{i+1}" name="{req['functional_requirement']}"/>
    <bpmn:sequenceFlow id="Flow_{i+1}" sourceRef="{('StartEvent_1' if i == 0 else f'Task_{i}')}" targetRef="Task_{i+1}"/>
"""

    xml += f"""    <bpmn:endEvent id="EndEvent_1" name="End Process"/>
    <bpmn:sequenceFlow id="Flow_end" sourceRef="Task_{len(requirements)}" targetRef="EndEvent_1"/>
  </bpmn:process>
</bpmn:definitions>
"""
    return xml
