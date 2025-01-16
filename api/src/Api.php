<?php
namespace Adc;
use \Adc\Conn;

class Api{
  public $pdo;
  function __construct(){
    $this->pdo = new Conn();
  }

  public function getObjectById(int $id){
    $array=$this->pdo->simple($this->getQuery(["artifact.id"=>$id]));
    $response = $this->buildResponse($array);
    header('Content-Type: application/ld+json');
    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  }

  public function getAllObjects(){
    $array = $this->pdo->simple($this->getQuery([]));
    $response = $this->buildResponse($array);
    header('Content-Type: application/ld+json');
    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  }
  
  public function buildResponse(array $array){
    $records = [];
    foreach ($array as $row) {
      $records[] = [
        "link" => $row['link'],
        "doi" => $row['doi'],
        "name" => $row['name'],
        "class" => $row['class'],
        "specific_class" => $row['specific_class'],
        "typology" => $row['typology'],
        "start_chronology" => $row['start_chronology'],
        "end_chronology" => $row['end_chronology'],
        "conservation_state" => $row['conservation_state'],
        "object_condition" => $row['object_condition'],
        "is_museum_copy" => (bool)$row['is_museum_copy'],
        "description" => $row['description'],
        "notes" => $row['notes'],
        "author" => $row['author'],
        "owner" => $row['owner'],
        "inventory" => $row['inventory'],
        "license" => $row['license'],
        "created_at" => $row['created_at'],
        "last_update" => $row['last_update']
      ];
    }
  
    return [
      "@context" => $this->getContext(),
      "@graph" => $records
    ];
   
  }

  private function getContext(){
    return [
        "@vocab" => "http://www.cidoc-crm.org/cidoc-crm/",
        "crm" => "http://www.cidoc-crm.org/cidoc-crm/",
        "link" => "crm:P1_is_identified_by",
        "doi" => "crm:P1_is_identified_by",
        "name" => "crm:P102_has_title",
        "class" => "crm:P2_has_type",
        "specific_class" => "crm:P2_has_type",
        "typology" => "crm:P3_has_note",
        "start_chronology" => [
          "@id" => "crm:P4_has_time-span",
          "@type" => "crm:E52_Time-Span"
        ],
        "end_chronology" => [
          "@id" => "crm:P4_has_time-span",
          "@type" => "crm:E52_Time-Span"
        ],
        "conservation_state" => "crm:P44_has_condition",
        "object_condition" => "crm:P44_has_condition",
        "is_museum_copy" => [
          "@id" => "crm:P70_documents",
          "@type" => "xsd:boolean"
        ],
        "description" => "crm:P3_has_note",
        "notes" => "crm:P3_has_note",
        "author" => "crm:P94_has_created",
        "owner" => "crm:P51_has_current_owner",
        "inventory" => "crm:P1_is_identified_by",
        "license" => "dcterms:license",
        "created_at" => [
          "@id" => "crm:P4_has_time-span",
          "@type" => "crm:E52_Time-Span"
        ],
        "last_update" => [
          "@id" => "crm:P4_has_time-span",
          "@type" => "crm:E52_Time-Span"
        ]
    ];
  }

  private function getQuery(array $array){
    $array['artifact.status'] = 2;
    $filter = array_map(function($key, $value) { return "$key = $value";}, array_keys($array), $array);
    $where = implode(' AND ', $filter);
    return "select 
 concat('https://dyncolldev.ht.lu.se/plus/artifact_view.php?item=',artifact.id) as link,
 model.doi,
 artifact.name,
 class.value as class,
 typology.value as specific_class,
 artifact.type as typology,
 artifact.start as start_chronology,
 artifact.end as end_chronology,
 conservation.value as conservation_state,
 list_object_condition.value as object_condition,
 if(artifact.is_museum_copy = 1, 'true', 'false') as is_museum_copy,
 artifact.description,
 artifact.notes,
 concat(auth.first_name,' ',auth.last_name) author,
 o.name owner,
 artifact.inventory,
 concat(license.license,' (',license.acronym,')') as license,
 cast(artifact.created_at as date) created_at,
 cast(artifact.last_update as date) last_update
from artifact
inner join artifact_model am on am.artifact = artifact.id
inner join model on am.model = model.id
inner join institution o on artifact.owner = o.id
inner join user on artifact.author = user.id
inner join person auth on user.person = auth.id
inner join license on artifact.license = license.id
inner join list_category_class class on artifact.category_class = class.id
inner join list_category_specs typology on artifact.category_specs = typology.id
inner join list_conservation_state conservation on artifact.conservation_state = conservation.id
inner join list_object_condition on artifact.object_condition = list_object_condition.id
where ".$where."
order by artifact.id asc;";
  }
}
?>
