/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "StudentEnrollmentDB";
var studentRelationName = "StudentEnrollmentData";
var connToken = "90937883|-31949272317563411|90952144";

$("#studentRollNo").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);   
}

function getStudentRollNoAsJsonObj() {
    var studentRollNo = $("#studentRollNo").val();
    var jsonStr = {
        rollNo: studentRollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#studenFullName").val(record.name);
    $("#studentClass").val(record.class);
    $("#studentBirthDate").val(record.birthDate);
    $("#studentAddress").val(record.address);
    $("#studentEnrollmentDate").val(record.enrollDate);
    
}

function resetForm(){
    $("#studentRollNo").val("");
    $("#studentFullName").val("");
    $("#studentClass").val("");
    $("#studentBirthDate").val("");
    $("#studentAddress").val("");
    $("#studentEnrolledDate").val("");
    $("#studentRollNo").prop('disabled',false);
    $("#save").prop('disabled',true);
    $("#update").prop('disabled',true);
    $("#reset").prop('disabled',true);
    $("#studentRollNo").focus();
}

function validateData() {
    var studentRollNo, studentFullName, studentClass, studentBirthDate, studentAddress, studentEnrolledDate;
    studentRollNo = $("#studentRollNo").val();
    studentFullName = $("#studentFullName").val();
    studentClass = $("#studentClass").val();
    studentBirthDate = $("#studentBirthDate").val();
    studentAddress = $("#studentAddress").val();
    studentEnrolledDate = $("#studentEnrolledDate").val();
    
    if(studentRollNo === ""){
        alert("Student Roll-No missing");
        $("#studentRollNo").focus();
        return " ";
    }
    
    if(studentFullName === ""){
        alert("Student Full-Name missing");
        $("#studentFullName").focus();
        return "";
    }
    
    if(studentClass === ""){
        alert("Student class missing");
        $("#studentClass").focus();
        return "";
    }
    
    if(studentBirthDate === ""){
        alert("Student Birth-Date missing");
        $("#studentBirthDate").focus();
        return "";
    }
    
    if(studentAddress === ""){
        alert("Student address missing");
        $("#studentAddress").focus();
        return "";
    }
    
    if(studentEnrolledDate === ""){
        alert("Student Enrolled-Date missing");
        $("#studentEnrolledDate").focus();
        return "";
    }
    
    var jsonStrObj = {
        rollNo: studentRollNo,
        fullName: studentFullName,
        class: studentClass,
        birthDate: studentBirthDate,
        address: studentAddress,
        enrolledDate: studentEnrolledDate 
    };
    return JSON.stringify(jsonStrObj);
}

 function executeCommandAtGivenBaseURL(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function getStudent(){
    var studentRollNoJsonObj = getStudentRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,studentDBName, studentRelationName, studentRollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    
    if(resJsonObj.status === 400){
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#studentFullName").focus();
    } else if(resJsonObj.status === 200) {
        $("#studentRollNo").prop('disabled', true);
        fillData(resJsonObj);
        
        $("#update").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#studentFullName").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#studentRollNo").focus();  
}

function updateData(){
    $("#update").prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#studentRollNo").focus();
}