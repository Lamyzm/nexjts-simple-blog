"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * 소개 페이지 내용
 * 이 파일을 수정하여 사이트 소개 내용을 작성하세요.
 */
export function IntroduceContent() {
  return (
    <Accordion>
      <AccordionItem id="about-accordion" value="about">
        <AccordionTrigger className="text-lg font-mono">
          About Us
        </AccordionTrigger>
        <AccordionContent className="text-zinc-300 leading-relaxed font-light border-t border-zinc-800 mt-4 pt-4">
          <p>여기에 사이트 소개 내용을 작성하세요.</p>
          <p>여러 문단으로 나누어 작성할 수 있습니다.</p>
          <p>Accordion을 추가하여 여러 섹션을 만들 수도 있습니다.</p>
        </AccordionContent>
      </AccordionItem>

      {/* 섹션 추가 예시 */}
      {/*
      <AccordionItem id="mission-accordion" value="mission">
        <AccordionTrigger className="text-lg font-mono">
          Our Mission
        </AccordionTrigger>
        <AccordionContent className="text-zinc-300 leading-relaxed font-light border-t border-zinc-800 mt-4 pt-4">
          <p>미션 내용...</p>
        </AccordionContent>
      </AccordionItem>
      */}
    </Accordion>
  );
}
