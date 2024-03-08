---
title: MySQL练习题
author: chumeng
date: '2022-9-9'
---

> 来源于网络收集
>



## 表数据

```sql
CREATE TABLE `course` (
  `cno` char(10) DEFAULT NULL,
  `cname` varchar(20) DEFAULT NULL,
  `tno` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
INSERT INTO `course` VALUES ('c001','J2SE','t002'),('c002','Java Web','t002'),('c003','SSH','t001'),('c004','Oracle','t001'),('c005','SQL SERVER 2005','t003'),('c006','C#','t003'),('c007','JavaScript','t002'),('c008','DIV+CSS','t001'),('c009','PHP','t003'),('c010','EJB3.0','t002');

CREATE TABLE `sc` (
  `sno` char(10) DEFAULT NULL,
  `cno` char(10) DEFAULT NULL,
  `score` double(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
INSERT INTO `sc` VALUES ('s001','c001',78.90),('s002','c001',80.90),('s003','c001',81.90),('s004','c001',60.90),('s001','c002',82.90),('s002','c002',72.90),('s003','c002',81.90),('s001','c003',59.00);

CREATE TABLE `student` (
  `sno` char(10) NOT NULL,
  `sname` char(20) DEFAULT NULL,
  `sage` int DEFAULT NULL,
  `ssex` char(5) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
INSERT INTO `student` VALUES ('s001','张三',23,'男'),('s002','李四',23,'男'),('s003','吴鹏',25,'男'),('s004','琴沁',20,'女'),('s005','王丽',20,'女'),('s006','李波',21,'男'),('s007','刘玉',21,'男'),('s008','萧蓉',21,'女'),('s009','陈萧晓',23,'女'),('s010','陈美',22,'女');

CREATE TABLE `teacher` (
  `tno` char(10) NOT NULL,
  `tname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`tno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
INSERT INTO `teacher` VALUES ('t001','刘阳'),('t002','谌燕'),('t003','胡明星');
```





#### 学生表

<img src="..\images\student.png" style="zoom:80%;" />

#### 教师表

<img src="..\images\teacher.png" style="zoom:80%;" />

#### 课程表

<img src="..\images\course.png" style="zoom:80%;" />

#### SC

<img src="..\images\sc.png" style="zoom:80%;" />



-------------------------------------------------------------分隔----------------------------------------------------------------



## 题目



1. ### 查询“c001”课程比“c002”课程成绩高的所有学生的学号

```sql
select a.sno from
              (select * from sc where cno='c001') a,
              (select * from sc where cno='c002') b
where a.sno=b.sno and a.score > b.score;


select a.sno from sc a
where a.cno='c001' and 
      exists(
          select b.sno from sc b 
          where b.cno='c002' and 
                a.sno=b.sno and 
                a.score > b.score
          );
```



2. ### 查询平均成绩大于60 分的同学的学号和平均成绩

```sql
select student.sno,avg(sc.score) from sc,student
where sc.sno=student.sno
group by sc.sno
having avg(sc.score) > 60;
```

