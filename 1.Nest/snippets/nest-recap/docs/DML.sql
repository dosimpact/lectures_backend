
-- [ step1,2 ] 
-- total target
select count(*) from crawling_target_entity cte;
-- crawling success
select count(*) from crawling_target_entity cte where "isCrawled" = true;
-- crawling false
select count(*) from crawling_target_entity cte where "isCrawled" = false;
-- check crawling error 
select count(*) from crawling_target_entity cte where "contentHTML" = '' and title != '' ; 


select * from crawling_target_entity cte limit 10;
select * from crawling_target_entity cte where cte."isCrawled"  = true;

-- [ step 3 ]
select count(*) from crawling_target_entity cte where "isCrawled" = true and "isRewrited" = false ;
select count(*) from crawling_target_entity cte where "isCrawled" = true and "isRewrited" = true ;

-- token cost, $0.0010 / 1K tokens	$0.0020 / 1K tokens
select sum(gl.tokens),max(gl.tokens),min(gl.tokens)  from gpt_log gl ;

-- search docs 
select * from crawling_target_entity cte where "rewritedMarkdown"  like '%Cultural%' limit 100;

-- [ step 4 ]
-- consumed list
select * from crawling_target_entity cte where cte."isConsumed" =true ;

-- consumed list to specfiic user
select * from crawling_target_entity cte where cte."isConsumed" =true and cte."consumedTo" ='user1';

-- rollback  consumed list
UPDATE crawling_target_entity  set "isConsumed"  = false  from crawling_target_entity cte1
WHERE cte1.id IN (SELECT cte.id  from crawling_target_entity cte WHERE cte."isConsumed"  = true);




