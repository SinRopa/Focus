
var GameData = 
{
    PlayerHP_Current : 100,
    PlayerHP_Max : 100,

    EnemyHP_Current : 100,
    EnemyHP_Max : 100,

    CurrentStage: 0,
    MaxStageReached: 0,

    Focus_Available: 1,
    Focus_Total: 1,
    Focus_BossDropped: 1,

    Focus_Training_Attack: 0,
    Focus_Training_Defense: 0,
    Focus_Training_Health: 0,

    Training_Levels_Attack: 0,
    Training_Levels_Defense: 0,
    Training_Levels_Health: 0,

    Player_AttackPower : 2,
    Enemy_AttackPower : 2,

    Player_Defense : 0,
    Enemy_Defense : 1,

    Combat : true,

    Training_Progress_Attack: 0,
    Training_Progress_Defense: 0,
    Training_Progress_Health: 0,
}


function SaveGame()
{

    localStorage.setItem("save",JSON.stringify(GameData));
    $('#Toast_Saved').toast('show');
}

function LoadGame()
{

    var savegame = JSON.parse(localStorage.getItem("save"));

    
    if (typeof savegame.PlayerHP_Current !== "undefined") GameData.PlayerHP_Current = savegame.PlayerHP_Current;
    if (typeof savegame.PlayerHP_Max !== "undefined") GameData.PlayerHP_Max = savegame.PlayerHP_Max;
    if (typeof savegame.EnemyHP_Current !== "undefined") GameData.EnemyHP_Current = savegame.EnemyHP_Current;
    if (typeof savegame.EnemyHP_Max !== "undefined") GameData.EnemyHP_Max = savegame.EnemyHP_Max;
    if (typeof savegame.CurrentStage !== "undefined") GameData.CurrentStage = savegame.CurrentStage;
    if (typeof savegame.MaxStageReached !== "undefined") GameData.MaxStageReached = savegame.MaxStageReached;
    if (typeof savegame.Focus_Available !== "undefined") GameData.Focus_Available = savegame.Focus_Available;
    if (typeof savegame.Focus_Total !== "undefined") GameData.Focus_Total = savegame.Focus_Total;
    if (typeof savegame.Focus_BossDropped !== "undefined") GameData.Focus_BossDropped = savegame.Focus_BossDropped;
    if (typeof savegame.Focus_Training_Attack !== "undefined") GameData.Focus_Training_Attack = savegame.Focus_Training_Attack;
    if (typeof savegame.Focus_Training_Defense !== "undefined") GameData.Focus_Training_Defense = savegame.Focus_Training_Defense;
    if (typeof savegame.Focus_Training_Health !== "undefined") GameData.Focus_Training_Health = savegame.Focus_Training_Health;
    if (typeof savegame.Training_Levels_Attack !== "undefined") GameData.Training_Levels_Attack = savegame.Training_Levels_Attack;
    if (typeof savegame.Training_Levels_Defense !== "undefined") GameData.Training_Levels_Defense = savegame.Training_Levels_Defense;
    if (typeof savegame.Training_Levels_Health !== "undefined") GameData.Training_Levels_Health = savegame.Training_Levels_Health;
    if (typeof savegame.Player_AttackPower !== "undefined") GameData.Player_AttackPower = savegame.Player_AttackPower;
    if (typeof savegame.Enemy_AttackPower !== "undefined") GameData.Enemy_AttackPower = savegame.Enemy_AttackPower;
    if (typeof savegame.Player_Defense !== "undefined") GameData.Player_Defense = savegame.Player_Defense;
    if (typeof savegame.Enemy_Defense !== "undefined") GameData.Enemy_Defense = savegame.Enemy_Defense;
    if (typeof savegame.Training_Progress_Attack !== "undefined") GameData.Training_Progress_Attack = savegame.Training_Progress_Attack;
    if (typeof savegame.Training_Progress_Defense !== "undefined") GameData.Training_Progress_Defense = savegame.Training_Progress_Defense;
    if (typeof savegame.Training_Progress_Health !== "undefined") GameData.Training_Progress_Health = savegame.Training_Progress_Health;
    //if (typeof savegame. !== "undefined") GameData. = savegame.;
    
    //UpdateEnemyStats();
    UpdatePlayerStats();
    DrawStage();
    
}

function Combat()
{
    
    
    if(GameData.Combat){
    GameData.EnemyHP_Current -= Math.max(0,GameData.Player_AttackPower - GameData.Enemy_Defense);
    GameData.PlayerHP_Current -= Math.max(0, GameData.Enemy_AttackPower - GameData.Player_Defense);

    if (GameData.EnemyHP_Current <= 0){GameData.EnemyHP_Current =0;KillEnemy();}
    if (GameData.PlayerHP_Current <= 0){GameData.PlayerHP_Current=0;KillPlayer();}
    }
    DrawHpBars();

}

function DrawHpBars()
{
    interface.PlayerHPBar.innerHTML = Math.floor(GameData.PlayerHP_Current);
    interface.PlayerHPBar.style.width = ((GameData.PlayerHP_Current / GameData.PlayerHP_Max)*100) +"%";

    interface.EnemyHPBAR.innerHTML = Math.floor(GameData.EnemyHP_Current);
    interface.EnemyHPBAR.style.width = ((GameData.EnemyHP_Current / GameData.EnemyHP_Max)*100) +"%";

}
function UpdatePlayerStats()
{
    GameData.PlayerHP_Max = 100+ (10 * Math.pow(1.05, GameData.Training_Levels_Health));
    GameData.Player_AttackPower = 2 + GameData.Training_Levels_Attack;
    GameData.Player_Defense = GameData.Training_Levels_Defense;

    interface.StatsTextAttack.innerHTML = Math.floor(GameData.Player_AttackPower);

    interface.StatsTextDefense.innerHTML = Math.floor(GameData.Player_Defense);
    interface.StatsTextHealth.innerHTML = Math.floor(GameData.PlayerHP_Max);
}
function RevivePlayer()
{
    UpdatePlayerStats();
    GameData.PlayerHP_Current = GameData.PlayerHP_Max;
    GameData.Combat = true;
}
function UpdateEnemyStats()
{
var level = GameData.CurrentStage;


GameData.EnemyHP_Max = (100 * Math.pow(1.5, level));
GameData.Enemy_AttackPower =(1 + Math.pow(1.4, level));
GameData.Enemy_Defense = (Math.pow(1.1, level));

GameData.EnemyHP_Current = GameData.EnemyHP_Max;

}

function KillPlayer()
{
    GameData.Combat = false;
    GameData.CurrentStage = 0;
    UpdateEnemyStats();
    DrawStage();
    RevivePlayer();

}

function KillEnemy()
{
    GameData.Combat = false;
    if(GameData.CurrentStage >1 && GameData.CurrentStage %10 == 0){GameData.Focus_BossDropped++; $('#Toast_BossKill').toast('show');}
    if(GameData.CurrentStage > GameData.MaxStageReached){GameData.MaxStageReached = GameData.CurrentStage; }
    GameData.CurrentStage++;
    DrawStage();
    CalculateTotalFocus();
    UpdateEnemyStats();
    GameData.Combat = true;
}

function DrawStage()
{
interface.CurrentStageText.innerHTML = GameData.CurrentStage;
interface.MaxStageText.innerText = GameData.MaxStageReached;
}

function CalculateTrainingExp(level)
{
return (level + 1) *50;

}

function ProgressTraining()
{
GameData.Training_Progress_Attack+= GameData.Focus_Training_Attack;
GameData.Training_Progress_Defense += GameData.Focus_Training_Defense;
GameData.Training_Progress_Health += GameData.Focus_Training_Health;

CheckTrainingLevelUps();
}

function CheckTrainingLevelUps()
{

    var RequiredAttackExp = CalculateTrainingExp(GameData.Training_Levels_Attack);
    var RequiredDefenseExp = CalculateTrainingExp(GameData.Training_Levels_Defense);
    var RequiredHealthExp = CalculateTrainingExp(GameData.Training_Levels_Health);

    if(GameData.Training_Progress_Attack >= RequiredAttackExp)
    {
        GameData.Training_Levels_Attack++;
        GameData.Training_Progress_Attack-=RequiredAttackExp;
        UpdatePlayerStats();
    }

    if(GameData.Training_Progress_Defense >= RequiredDefenseExp)
    {
        GameData.Training_Levels_Defense++;
        GameData.Training_Progress_Defense-=RequiredDefenseExp;
        UpdatePlayerStats();
    }

    if(GameData.Training_Progress_Health >= RequiredHealthExp)
    {
        GameData.Training_Levels_Health++;
        GameData.Training_Progress_Health-=RequiredHealthExp;
        UpdatePlayerStats();
    }
    GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;
    DrawTraining();
}

function DrawTraining()
{
interface.ActiveAttackText.innerHTML = GameData.Focus_Training_Attack;
interface.AttackLevelText.innerHTML = GameData.Training_Levels_Attack;
interface.AttackProgress.style.width = ((GameData.Training_Progress_Attack / CalculateTrainingExp(GameData.Training_Levels_Attack))*100)+"%";
interface.AttackProgress.innerHTML = Math.floor(((GameData.Training_Progress_Attack / CalculateTrainingExp(GameData.Training_Levels_Attack))*100))+"%";

interface.ActiveDefenseText.innerHTML = GameData.Focus_Training_Defense;
interface.DefenseLevelText.innerHTML = GameData.Training_Levels_Defense;
interface.DefenseProgress.style.width = ((GameData.Training_Progress_Defense / CalculateTrainingExp(GameData.Training_Levels_Defense))*100)+"%";
interface.DefenseProgress.innerHTML = Math.floor(((GameData.Training_Progress_Defense / CalculateTrainingExp(GameData.Training_Levels_Defense))*100))+"%";

interface.ActiveHealthText.innerHTML = GameData.Focus_Training_Health;
interface.HealthLevelText.innerHTML = GameData.Training_Levels_Health;
interface.HealthProgress.style.width = ((GameData.Training_Progress_Health / CalculateTrainingExp(GameData.Training_Levels_Health))*100)+"%";
interface.HealthProgress.innerHTML = Math.floor(((GameData.Training_Progress_Health / CalculateTrainingExp(GameData.Training_Levels_Health))*100))+"%";

interface.AvailableFocusText.innerHTML = GameData.Focus_Available;
}

function CalculateTotalFocus()
{
    GameData.Focus_Total = 1+ (GameData.Focus_BossDropped * GameData.MaxStageReached);
    GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;

}
function AddFocus(value, stat)
{

if(stat == "A" && GameData.Focus_Available >= value){GameData.Focus_Training_Attack += value;}
if(stat == "D" && GameData.Focus_Available >= value){GameData.Focus_Training_Defense += value;}
if(stat == "H" && GameData.Focus_Available >= value){GameData.Focus_Training_Health += value;}

GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;
DrawTraining();
}
function RemoveFocus(value, stat)
{

if(stat == "A" && GameData.Focus_Training_Attack >= value){GameData.Focus_Training_Attack -= value;}
if(stat == "D" && GameData.Focus_Training_Defense >= value){GameData.Focus_Training_Defense -= value;}
if(stat == "H" && GameData.Focus_Training_Health >= value){GameData.Focus_Training_Health -= value;}

GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;
DrawTraining();
}
function MaxFocus(stat)
{

    if(stat == "A" && GameData.Focus_Available >= 1){GameData.Focus_Training_Attack += GameData.Focus_Available;}
    if(stat == "D" && GameData.Focus_Available >= 1){GameData.Focus_Training_Defense += GameData.Focus_Available;}
    if(stat == "H" && GameData.Focus_Available >= 1){GameData.Focus_Training_Health += GameData.Focus_Available;}

GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;
DrawTraining();
}

function DropFocus(stat)
{

    if(stat == "A" ){GameData.Focus_Training_Attack =0;}
    if(stat == "D" ){GameData.Focus_Training_Defense =0;}
    if(stat == "H" ){GameData.Focus_Training_Health =0;}

GameData.Focus_Available =  GameData.Focus_Total - GameData.Focus_Training_Attack - GameData.Focus_Training_Defense - GameData.Focus_Training_Health;
DrawTraining();
}

var interface = 
{
PlayerHPBar : document.getElementById('Data_Player_HPBar'),
EnemyHPBAR : document.getElementById('Data_Enemy_HPBar'),
CurrentStageText : document.getElementById('Data_Stage_Current'),
MaxStageText : document.getElementById('Data_Stage_Max'),
AvailableFocusText : document.getElementById('Data_Available_Focus'),

ActiveAttackText : document.getElementById('Data_Active_Attack_Focus'),
AttackLevelText : document.getElementById('Data_Current_Attack_Level'),
AttackProgress : document.getElementById('Data_Attack_Training'),

ActiveDefenseText : document.getElementById('Data_Active_Defense_Focus'),
DefenseLevelText : document.getElementById('Data_Current_Defense_Level'),
DefenseProgress : document.getElementById('Data_Defense_Training'),

ActiveHealthText : document.getElementById('Data_Active_Health_Focus'),
HealthLevelText : document.getElementById('Data_Current_Health_Level'),
HealthProgress : document.getElementById('Data_Health_Training'),

StatsTextHealth: document.getElementById('Data_Player_MaxHealth'),
StatsTextAttack: document.getElementById('Data_Player_Attack_Power'),
StatsTextDefense: document.getElementById('Data_Player_Defense_Power'),

}



window.setInterval(function(){
Combat();
}, 500);

window.setInterval(function(){
    
    ProgressTraining();
    if(GameData.Focus_Available > 0){$("#Data_Available_Focus").addClass("blink_me");}
    else{$("#Data_Available_Focus").removeClass("blink_me");}
    }, 100);


$(document).ready(function(){
    
    
});

window.setInterval(function(){SaveGame();}, 30000);
 