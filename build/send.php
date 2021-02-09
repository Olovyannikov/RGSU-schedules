<?php

function soap()
{
    $uri = 'http://192.168.132.128/1c_uopv82/ws/Schedule.1cws?wsdl';
    $params = ['login' => 'WS', 'password' => 'F6D4G8K5'];
    $client = new SoapClient($uri, $params);
    return $client;
}


function getTeacher()
{
    $result = soap()->GetTeachers();
    $teachers = $result->return->teacher;
    $str = [];
    foreach ($teachers as $t) {
        if (preg_match('/\d/', $t->fio)) {
            continue;
        } else {
            array_push($str, $t->fio);
        }
    }
    $a['data'] = $str;
    echo json_encode($a, JSON_UNESCAPED_UNICODE);
}

function getGroup()
{
    $result = soap()->GetGroups();
    $groups = $result->return->group;
    $str = [];
    foreach ($groups as $t) {
        array_push($str, ['guid' => $t->guid, 'name' => $t->name]);
    }
    $a['data'] = $str;
    echo json_encode($a, JSON_UNESCAPED_UNICODE);
}

function getSchedule($type, $guid)
{
    if ($type == 'group') {
        $guid = ['guidgroup' => $guid];
    } else if ($type == 'teacher') {
        $guid = ['guidteacher' => $guid];
    } else {
        echo 'Unknown parametr';
    }
    var_dump($guid);
    $result = soap()->GetSchedule($guid);
    return $result;
}

if ($_GET['action'] == 'getTeacher') {
    getTeacher();
}
if ($_GET['action'] == 'getGroup') {
    getGroup();
}
if ($_GET['action'] == 'getTestSchedule') {
    getTestShegule();
}

function getTestShegule()
{
    $week = ['monday' => 'Понедельник', 'tuesday' => 'Вторник', 'wednesday' => 'Среда', 'thursday' => 'Четверг', 'friday' => 'Пятница', 'saturday' => 'Суббота', 'sunday' => 'Воскресенье'];
    $day = strtolower(date('l'));
    $schedule = "<tbody>
    <tr class='card__table-row'>
    <th class='card__table-cell'>Время</th>
    <th width='167' class='card__table-cell card__table-cell--auditory'>Аудитория
        <svg width='24' height='24'>
            <use href='#pin'></use>
        </svg>
    </th>
    <th class='card__table-cell'>Тип занятия</th>
    <th class='card__table-cell'>Дисциплина</th>
    <th class='card__table-cell'>Преподаватель</th>
    </tr>
    <tr class='card__table-row card__table-divider'>
    <td colspan='5' class='card__table-cell card__table-cell-divider'>" . date('d.m.Y') . " " . $week[$day] . "</td>
    </tr>";
    $connect = mysqli_connect('localhost', 'root', 'root', 'schedule');
    $query = mysqli_query($connect, "SELECT * FROM Schedule");
    while ($result = mysqli_fetch_assoc($query)) {
        $schedule .= "<tr class='card__table-row'>
    <td class='card__table-cell card__table-cell--date'>8:30 - 10:00</td>
    <td class='card__table-cell card__table-cell--class'>
    </td>
    <td width='203' class='card__table-cell card__table-cell--type'>Лекция</td>
    <td class='card__table-cell card__table-cell--disciple'> {$result['discipline']}</td>
    <td class='card__table-cell card__table-cell--teacher'>{$result['teacher']}<span
            class='card__table-teacherStatus'>к.соц.н.</span></td>
    </tr>";
    }
    $schedule .= "</tbody>";
    echo $schedule;
}

/*$groups = ["f68137f6-6141-11ea-8399-005056816137","f68137f7-6141-11ea-8399-005056816137","a309af54-5ca0-11ea-8399-005056816137","3fd67b28-471a-11e9-9b99-005056816137"];
    foreach($groups as $group){
    var_dump(getSchedule('group', $group), $group);
}*/
